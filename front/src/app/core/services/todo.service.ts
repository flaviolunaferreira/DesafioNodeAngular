import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
// Interfaces para padronizar os dados (POO)
interface Tarefa {
  id: string;
  descricao: string;
  prioridade: 'Alta' | 'Média' | 'Baixa';
  prazo: number | null; // Timestamp UNIX
  concluida: boolean;
  criada_em: number;
}

interface TarefaPayload {
  descricao: string;
  prioridade: 'Alta' | 'Média' | 'Baixa';
  prazo?: number;
}

interface Metricas {
  totalTarefas: number;
  tarefasConcluidas: number;
  tarefasPendentes: number;
  taxaConclusao: string; // Ex: '70.50'
  tempoMedioConclusaoHoras: string | null; // Ex: '2.50'
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = environment.apiUrl + '/todos';

  constructor(private http: HttpClient) { }

  // -----------------------------------------------------
  // CRUD
  // -----------------------------------------------------

  obterTodasTarefas(): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(this.apiUrl);
  }

  criarTarefa(payload: TarefaPayload): Observable<Tarefa> {
    return this.http.post<Tarefa>(this.apiUrl, payload);
  }

  atualizarTarefa(id: string, payload: TarefaPayload): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, payload);
  }

  alterarStatus(id: string, concluida: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, { concluida });
  }

  removerTarefa(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // -----------------------------------------------------
  // MÉTRICAS
  // -----------------------------------------------------

  obterMetricas(): Observable<Metricas> {
    return this.http.get<Metricas>(`${this.apiUrl}/metrics`);
  }
}
