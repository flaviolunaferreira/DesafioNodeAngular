import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TodoService } from 'src/app/core/services/todo.service';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo-form.html',
  styleUrls: ['./todo-form.css']
})
export class TodoFormComponent implements OnInit {
  @Output() tarefaAdicionada = new EventEmitter<any>();
  todoForm!: FormGroup;
  prioridades = ['Alta', 'Média', 'Baixa'];
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private fb: FormBuilder, private todoService: TodoService) { }

  ngOnInit(): void {
    this.todoForm = this.fb.group({
      descricao: ['', Validators.required],
      prioridade: ['Média', Validators.required],
      prazo: [null] // Campo de data opcional
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    if (this.todoForm.invalid) {
      this.todoForm.markAllAsTouched();
      return;
    }

    const formValue = this.todoForm.value;

    // Converte a data de prazo (string ISO) para timestamp UNIX (milisegundos)
    const payload = {
      ...formValue,
      prazo: formValue.prazo ? new Date(formValue.prazo).getTime() : null
    };

    this.todoService.criarTarefa(payload).subscribe({
      next: (res) => {
        this.successMessage = 'Tarefa criada com sucesso!';
        this.todoForm.reset({ prioridade: 'Média', prazo: null });
        this.tarefaAdicionada.emit(res);
      },
      error: (err) => {
        this.errorMessage = err.error?.mensagem || 'Erro ao criar a tarefa.';
      }
    });
  }
}
