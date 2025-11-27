// src/controllers/todo.controller.js

const Tarefa = require('../models/Tarefa');

/**
 * Controller para obter métricas de produtividade.
 */
exports.obterMetricas = async (req, res) => {
    try {
        const metricas = await Tarefa.obterMetricas(req.userId);
        res.json(metricas);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: "Erro ao buscar métricas." });
    }
};

/**
 * Controller para obter todas as tarefas do usuário.
 */
exports.obterTodas = async (req, res) => {
    try {
        const tarefas = await Tarefa.obterTodasPorUsuario(req.userId);
        res.json(tarefas);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: "Erro ao buscar tarefas." });
    }
};

/**
 * Controller para criar uma nova tarefa.
 */
exports.criarTarefa = async (req, res) => {
    const { descricao, prioridade, prazo } = req.body;

    if (!descricao || !prioridade || !['Alta', 'Média', 'Baixa'].includes(prioridade)) {
        return res.status(400).json({ mensagem: "Descrição e Prioridade (Alta, Média, Baixa) são obrigatórios." });
    }

    try {
        const novaTarefa = await Tarefa.criar(req.userId, descricao, prioridade, prazo);
        res.status(201).json(novaTarefa);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: "Erro ao criar a tarefa." });
    }
};

/**
 * Controller para obter uma tarefa específica.
 */
exports.obterPorId = async (req, res) => {
    try {
        const tarefa = await Tarefa.obterPorId(req.params.id, req.userId);
        if (!tarefa) {
            return res.status(404).json({ mensagem: "Tarefa não encontrada." });
        }
        res.json(tarefa);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: "Erro ao buscar a tarefa." });
    }
};

/**
 * Controller para atualizar (editar) uma tarefa.
 */
exports.atualizarTarefa = async (req, res) => {
    const { descricao, prioridade, prazo } = req.body;

    if (!descricao || !prioridade || !['Alta', 'Média', 'Baixa'].includes(prioridade)) {
        return res.status(400).json({ mensagem: "Descrição e Prioridade são obrigatórios." });
    }

    try {
        await Tarefa.atualizar(req.params.id, req.userId, descricao, prioridade, prazo);
        res.json({ mensagem: "Tarefa atualizada com sucesso." });
    } catch (erro) {
        const status = erro.status || 500;
        const mensagem = erro.mensagem || "Erro ao atualizar a tarefa.";
        res.status(status).json({ mensagem });
    }
};

/**
 * Controller para alterar o status de conclusão da tarefa.
 */
exports.alterarStatus = async (req, res) => {
    const { concluida } = req.body;

    if (typeof concluida !== 'boolean') {
        return res.status(400).json({ mensagem: "O campo 'concluida' (boolean) é obrigatório." });
    }

    try {
        await Tarefa.alterarStatus(req.params.id, req.userId, concluida);
        res.json({ mensagem: `Tarefa marcada como ${concluida ? 'concluída' : 'pendente'}.` });
    } catch (erro) {
        const status = erro.status || 500;
        const mensagem = erro.mensagem || "Erro ao atualizar o status da tarefa.";
        res.status(status).json({ mensagem });
    }
};

/**
 * Controller para remover uma tarefa.
 */
exports.removerTarefa = async (req, res) => {
    try {
        await Tarefa.remover(req.params.id, req.userId);
        res.json({ mensagem: "Tarefa removida com sucesso." });
    } catch (erro) {
        const status = erro.status || 500;
        const mensagem = erro.mensagem || "Erro ao remover a tarefa.";
        res.status(status).json({ mensagem });
    }
};