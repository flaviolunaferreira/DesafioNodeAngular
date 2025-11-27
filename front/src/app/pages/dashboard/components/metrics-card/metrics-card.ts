import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Metricas {
  totalTarefas: number;
  tarefasConcluidas: number;
  tarefasPendentes: number;
  taxaConclusao: string;
  tempoMedioConclusaoHoras: string | null;
}

@Component({
  selector: 'app-metrics-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metrics-card.html',
  styleUrls: ['./metrics-card.css']
})
export class MetricsCardComponent {
  @Input() metricas: Metricas | null = null;
}
