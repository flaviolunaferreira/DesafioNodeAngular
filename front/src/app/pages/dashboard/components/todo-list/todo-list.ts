import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoItemComponent } from '../todo-item/todo-item';

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
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, TodoItemComponent],
  templateUrl: './todo-list.html',
  styleUrls: ['./todo-list.css']
})
export class TodoListComponent {
  @Input() tarefas: Tarefa[] = [];
  @Output() tarefaMudou = new EventEmitter<void>();

  get tarefasPendentes(): Tarefa[] {
    return this.tarefas.filter(t => !t.concluida);
  }

  get tarefasConcluidas(): Tarefa[] {
    return this.tarefas.filter(t => t.concluida);
  }

  onTarefaAction(): void {
    // Sinaliza ao Dashboard para recarregar a lista e métricas
    this.tarefaMudou.emit();
  }
}
