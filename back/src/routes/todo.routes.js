// src/routes/todo.routes.js

const express = require('express');
const todoController = require('../controllers/todo.controller');
const autenticarToken = require('../middleware/auth.middleware');

const router = express.Router();

router.use(autenticarToken); 

/**
 * @swagger
 * tags:
 *   - name: "Tarefas (TO-DO)"
 *     description: "Gerenciamento de tarefas do usuário"
 */

/**
 * @swagger
 * /todos/metrics:
 *   get:
 *     summary: Retorna métricas de produtividade do usuário
 *     tags:
 *       - "Tarefas (TO-DO)"
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Métricas calculadas com sucesso.
 */
router.get('/metrics', todoController.obterMetricas);

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Lista todas as tarefas (pendentes e concluídas) do usuário logado
 *     tags:
 *       - "Tarefas (TO-DO)"
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de todas as tarefas.
 */
router.get('/', todoController.obterTodas);

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Cria uma nova tarefa
 *     tags:
 *       - "Tarefas (TO-DO)"
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
 *     responses:
 *       '201':
 *         description: Tarefa criada com sucesso.
 */
router.post('/', todoController.criarTarefa);

/**
 * @swagger
 * /todos/{id}:
 *   get:
 *     summary: Obtém uma tarefa específica pelo ID
 *     tags:
 *       - "Tarefas (TO-DO)"
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da Tarefa
 *     responses:
 *       '200':
 *         description: Dados da tarefa.
 *       '404':
 *         description: Tarefa não encontrada.
 */
router.get('/:id', todoController.obterPorId);


/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: Atualiza (edita) uma tarefa existente
 *     tags:
 *       - "Tarefas (TO-DO)"
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da Tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
 *     responses:
 *       '200':
 *         description: Tarefa atualizada com sucesso.
 */
router.put('/:id', todoController.atualizarTarefa);


/**
 * @swagger
 * /todos/{id}/status:
 *   patch:
 *     summary: Altera o status da tarefa (concluída/pendente)
 *     tags:
 *       - "Tarefas (TO-DO)"
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da Tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TodoStatusUpdate'
 *     responses:
 *       '200':
 *         description: Status da tarefa alterado com sucesso.
 */
router.patch('/:id/status', todoController.alterarStatus);

/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Remove uma tarefa
 *     tags:
 *       - "Tarefas (TO-DO)"
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da Tarefa
 *     responses:
 *       '200':
 *         description: Tarefa removida com sucesso.
 *       '404':
 *         description: Tarefa não encontrada ou não pertence ao usuário.
 */
router.delete('/:id', todoController.removerTarefa);

module.exports = router;