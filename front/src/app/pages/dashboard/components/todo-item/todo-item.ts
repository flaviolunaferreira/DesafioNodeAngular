import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TodoService } from 'src/app/core/services/todo.service';

// Interfaces
interface Tarefa {
  id: string;
  descricao: string;
  prioridade: 'Alta' | 'Média' | 'Baixa';
  prazo: number | null;
  concluida: boolean;
  criada_em: number;
}

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './todo-item.html',
  styleUrls: ['./todo-item.css']
})
export class TodoItemComponent {
  @Input() tarefa!: Tarefa;
  @Output() statusAlterado = new EventEmitter<void>();
  @Output() tarefaRemovida = new EventEmitter<void>();

  constructor(private todoService: TodoService) { }

  marcarComoConcluida(): void {
    if (this.tarefa.concluida) return; // Já está concluída

    this.todoService.alterarStatus(this.tarefa.id, true).subscribe({
      next: () => {
        this.statusAlterado.emit(); // Informa a lista para recarregar
      },
      error: (err) => console.error('Erro ao concluir tarefa:', err)
    });
  }

  remover(): void {
    if (confirm(`Tem certeza que deseja remover a tarefa: "${this.tarefa.descricao}"?`)) {
      this.todoService.removerTarefa(this.tarefa.id).subscribe({
        next: () => {
          this.tarefaRemovida.emit(); // Informa a lista para recarregar
        },
        error: (err) => console.error('Erro ao remover tarefa:', err)
      });
    }
  }

  get prioridadeClass(): string {
    switch (this.tarefa.prioridade) {
      case 'Alta': return 'priority-high';
      case 'Média': return 'priority-medium';
      default: return 'priority-low';
    }
  }

  get isAtrasada(): boolean {
    if (!this.tarefa.prazo || this.tarefa.concluida) return false;
    return this.tarefa.prazo < Date.now();
  }
}
