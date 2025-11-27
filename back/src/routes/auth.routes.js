// src/routes/auth.routes.js

const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: "Autenticação"
 *     description: "Cadastro e Login de Usuários"
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Cadastra um novo usuário
 *     tags:
 *       - "Autenticação"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       '201':
 *         description: Usuário criado com sucesso.
 *       '409':
 *         description: E-mail já cadastrado.
 *       '400':
 *         description: Dados obrigatórios ausentes.
 */
router.post('/register', authController.registrar);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica o usuário e retorna o token JWT
 *     tags:
 *       - "Autenticação"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       '200':
 *         description: Login bem-sucedido. Retorna o token de acesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT
 *       '401':
 *         description: Credenciais inválidas.
 */
router.post('/login', authController.login);

module.exports = router;