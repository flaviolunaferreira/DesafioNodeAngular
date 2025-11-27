import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]]
    });
    // tentar preencher apenas o email a partir do localStorage ou do navigation state (não preencher senha por segurança)
    this.prefillFromStorageAndState();
  }

  private prefillFromStorageAndState(): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;

      // apenas o email será pré-preenchido por segurança
      let email: string | null = localStorage.getItem('email');

      // se não encontrar, tenta ler um objeto salvo (ex: 'usuario' ou 'user') e extrair email
      if (!email && (localStorage.getItem('usuario') || localStorage.getItem('user') || localStorage.getItem('registered_user') || localStorage.getItem('registeredUser'))) {
        const raw = localStorage.getItem('usuario') || localStorage.getItem('user') || localStorage.getItem('registered_user') || localStorage.getItem('registeredUser');
        if (raw) {
          try {
            const obj = JSON.parse(raw);
            email = obj.email || obj.usuarioEmail || obj.username || obj.user?.email || null;
          } catch {
            // se não for JSON, ignora
          }
        }
      }

      // também verifica se o router passou dados via history.state
      try {
        const state: any = history.state || {};
        if (!email && state?.email) email = state.email;
      } catch {
        // ignorar se não houver state
      }

      if (email) {
        this.loginForm.patchValue({ email });
      }
    } catch {
      // silêncio em caso de erro de leitura do localStorage
    }
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (this.loginForm.invalid) {
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {},
      error: (err) => {
        this.errorMessage = err.error?.mensagem || 'Erro ao realizar login. Tente novamente.';
      }
    });
  }
}
