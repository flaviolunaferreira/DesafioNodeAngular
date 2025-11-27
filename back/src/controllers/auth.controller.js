// src/controllers/auth.controller.js

const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

/**
 * Controller para registrar um novo usuário.
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

exports.registrar = async (req, res) => {
    const { nome, email, senha } = req.body;
    
    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: "Nome, e-mail e senha são obrigatórios." });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ mensagem: "O e-mail informado não possui um formato válido." });
    }

    try {
        const novoUsuario = await Usuario.criar(nome, email, senha);
        res.status(201).json({ mensagem: "Usuário criado com sucesso.", usuario: { id: novoUsuario.id, nome: novoUsuario.nome, email: novoUsuario.email } });
    } catch (erro) {
        const status = erro.status || 500;
        const mensagem = erro.mensagem || "Erro ao tentar cadastrar o usuário.";
        res.status(status).json({ mensagem });
    }
};

/**
 * Controller para realizar o login do usuário e gerar o JWT.
 */
exports.login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: "E-mail e senha são obrigatórios." });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ mensagem: "O e-mail informado não possui um formato válido." });
    }

    try {
        const usuario = await Usuario.buscarPorEmail(email);

        if (!usuario) {
            return res.status(401).json({ mensagem: "Credenciais inválidas." });
        }

        const corresponde = await usuario.compararSenha(senha);

        if (!corresponde) {
            return res.status(401).json({ mensagem: "Credenciais inválidas." });
        }

        const token = jwt.sign({ id: usuario.id }, JWT_SECRET, { expiresIn: '1h' }); 
        
        res.json({ token });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: "Erro interno no servidor." });
    }
};