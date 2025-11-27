// src/models/Tarefa.js

const db = require('../db/database');
const { randomUUID } = require('crypto');

class Tarefa {
    constructor(id, id_usuario, descricao, prioridade, prazo, concluida, criada_em, concluida_em) {
        this.id = id;
        this.id_usuario = id_usuario;
        this.descricao = descricao;
        this.prioridade = prioridade;
        this.prazo = prazo;
        this.concluida = concluida;
        this.criada_em = criada_em;
        this.concluida_em = concluida_em;
    }

    /**
     * Converte uma linha do DB em uma instância de Tarefa.
     * @param {object} linha
     * @returns {Tarefa}
     */
    static linhaParaInstancia(linha) {
        return new Tarefa(
            linha.id,
            linha.user_id,
            linha.description,
            linha.priority,
            linha.deadline,
            linha.completed === 1,
            linha.created_at,
            linha.completed_at
        );
    }
    
    /**
     * Cria uma nova tarefa.
     * @returns {Promise<Tarefa>}
     */
    static criar(id_usuario, descricao, prioridade, prazo) {
        return new Promise((resolver, rejeitar) => {
            const id = randomUUID(); 
            const concluida = 0;
            const criada_em = Date.now();

            db.run(`INSERT INTO todos (id, user_id, description, priority, deadline, completed, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                [id, id_usuario, descricao, prioridade, prazo || null, concluida, criada_em], 
                function(erro) {
                    if (erro) return rejeitar(erro);
                    resolver(new Tarefa(id, id_usuario, descricao, prioridade, prazo, false, criada_em, null));
                }
            );
        });
    }

    /**
     * Obtém todas as tarefas de um usuário.
     * @returns {Promise<Tarefa[]>}
     */
    static obterTodasPorUsuario(id_usuario) {
        return new Promise((resolver, rejeitar) => {
            db.all(`SELECT * FROM todos WHERE user_id = ? ORDER BY completed ASC, created_at DESC`, 
                [id_usuario], 
                (erro, linhas) => {
                    if (erro) return rejeitar(erro);
                    resolver(linhas.map(Tarefa.linhaParaInstancia));
                }
            );
        });
    }

    /**
     * Obtém uma tarefa específica.
     * @returns {Promise<Tarefa|null>}
     */
    static obterPorId(id, id_usuario) {
        return new Promise((resolver, rejeitar) => {
            db.get(`SELECT * FROM todos WHERE id = ? AND user_id = ?`, 
                [id, id_usuario], 
                (erro, linha) => {
                    if (erro) return rejeitar(erro);
                    if (!linha) return resolver(null);
                    resolver(Tarefa.linhaParaInstancia(linha));
                }
            );
        });
    }

    /**
     * Atualiza dados de uma tarefa.
     * @returns {Promise<object>}
     */
    static atualizar(id, id_usuario, descricao, prioridade, prazo) {
        return new Promise((resolver, rejeitar) => {
            db.run(`UPDATE todos SET description = ?, priority = ?, deadline = ? WHERE id = ? AND user_id = ?`, 
                [descricao, prioridade, prazo || null, id, id_usuario], 
                function(erro) {
                    if (erro) return rejeitar({ status: 500, mensagem: "Erro ao atualizar no DB." });
                    if (this.changes === 0) {
                        return rejeitar({ status: 404, mensagem: "Tarefa não encontrada ou não pertence ao usuário." });
                    }
                    resolver({ mudancas: this.changes });
                }
            );
        });
    }

    /**
     * Altera o status de conclusão da tarefa.
     * @returns {Promise<object>}
     */
    static alterarStatus(id, id_usuario, concluida) {
        return new Promise((resolver, rejeitar) => {
            const concluida_em = concluida ? Date.now() : null;
            db.run(`UPDATE todos SET completed = ?, completed_at = ? WHERE id = ? AND user_id = ?`, 
                [concluida ? 1 : 0, concluida_em, id, id_usuario], 
                function(erro) {
                    if (erro) return rejeitar({ status: 500, mensagem: "Erro ao atualizar status no DB." });
                    if (this.changes === 0) {
                        return rejeitar({ status: 404, mensagem: "Tarefa não encontrada ou não pertence ao usuário." });
                    }
                    resolver({ mudancas: this.changes });
                }
            );
        });
    }

    /**
     * Remove uma tarefa.
     * @returns {Promise<object>}
     */
    static remover(id, id_usuario) {
        return new Promise((resolver, rejeitar) => {
            db.run(`DELETE FROM todos WHERE id = ? AND user_id = ?`, 
                [id, id_usuario], 
                function(erro) {
                    if (erro) return rejeitar({ status: 500, mensagem: "Erro ao remover no DB." });
                    if (this.changes === 0) {
                        return rejeitar({ status: 404, mensagem: "Tarefa não encontrada ou não pertence ao usuário." });
                    }
                    resolver({ mudancas: this.changes });
                }
            );
        });
    }
    
    /**
     * Calcula métricas de produtividade.
     * @returns {Promise<object>}
     */
    static obterMetricas(id_usuario) {
        return new Promise((resolver, rejeitar) => {
            db.all(`SELECT completed, created_at, completed_at FROM todos WHERE user_id = ?`, 
                [id_usuario], 
                (erro, linhas) => {
                    if (erro) return rejeitar(erro);
                    
                    const total = linhas.length;
                    const concluidas = linhas.filter(r => r.completed === 1);
                    
                    let tempoMedioConclusaoMs = 0;
                    
                    if (concluidas.length > 0) {
                        const temposConclusao = concluidas
                            .filter(r => r.completed_at && r.created_at)
                            .map(r => r.completed_at - r.created_at);
                        
                        if (temposConclusao.length > 0) {
                            const soma = temposConclusao.reduce((a, b) => a + b, 0);
                            tempoMedioConclusaoMs = soma / temposConclusao.length;
                        }
                    }
                    
                    const tempoMedioConclusaoHoras = tempoMedioConclusaoMs > 0 
                        ? (tempoMedioConclusaoMs / (1000 * 60 * 60)).toFixed(2) 
                        : null;
                        
                    resolver({
                        totalTarefas: total,
                        tarefasConcluidas: concluidas.length,
                        tarefasPendentes: total - concluidas.length,
                        taxaConclusao: total > 0 ? ((concluidas.length / total) * 100).toFixed(2) : 0,
                        tempoMedioConclusaoHoras: tempoMedioConclusaoHoras
                    });
                }
            );
        });
    }
}

module.exports = Tarefa;