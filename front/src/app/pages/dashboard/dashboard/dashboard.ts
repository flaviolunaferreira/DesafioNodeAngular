import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from 'src/app/core/services/todo.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { TodoFormComponent } from '../components/todo-form/todo-form';
import { TodoListComponent } from '../components/todo-list/todo-list';
import { MetricsCardComponent } from '../components/metrics-card/metrics-card';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

// Interfaces repetidas para clareza no componente (embora já estejam no service)
interface Tarefa {
  id: string;
  descricao: string;
  prioridade: 'Alta' | 'Média' | 'Baixa';
  prazo: number | null;
  concluida: boolean;
  criada_em: number;
}
interface Metricas {
  totalTarefas: number;
  tarefasConcluidas: number;
  tarefasPendentes: number;
  taxaConclusao: string;
  tempoMedioConclusaoHoras: string | null;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TodoFormComponent, TodoListComponent, MetricsCardComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  tarefas: Tarefa[] = [];
  metricas: Metricas | null = null;
  loading: boolean = true;

  constructor(
    private todoService: TodoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.loading = true;
    // garantir que loading será desativado mesmo em fluxo de erro/completion
    this.todoService.obterTodasTarefas().pipe(
      finalize(() => { this.loading = false; })
    ).subscribe(data => {
      this.tarefas = data;
    }, error => {
      console.error("Erro ao carregar tarefas:", error);
    });

    // obter métricas em paralelo; falhas nas métricas não devem travar o loading das tarefas
    this.todoService.obterMetricas().subscribe(data => {
      this.metricas = data;
    }, error => {
      console.error("Erro ao carregar métricas:", error);
      this.metricas = null;
    });
  }

  // Tratadores de Eventos
  onTarefaAdicionada(novaTarefa: Tarefa): void {
    this.carregarDados(); // Recarrega para atualizar lista e métricas
  }

  onTarefaAtualizada(): void {
    this.carregarDados();
  }

  logout(): void {
    this.authService.logout();
  }
}
