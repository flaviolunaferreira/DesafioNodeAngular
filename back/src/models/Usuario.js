// src/models/Usuario.js

const db = require('../db/database');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

class Usuario {
    constructor(id, nome, email, hash_senha) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.hash_senha = hash_senha;
    }

    /**
     * Cria um novo usuário no banco de dados.
     * @param {string} nome
     * @param {string} email
     * @param {string} senha
     * @returns {Promise<object>} Objeto simplificado do usuário.
     */
    static criar(nome, email, senha) {
        return new Promise(async (resolver, rejeitar) => {
            try {
                const usuarioExistente = await Usuario.buscarPorEmail(email);
                if (usuarioExistente) {
                    return rejeitar({ status: 409, mensagem: "E-mail já cadastrado." });
                }

                const id = uuidv4();
                const hash_senha = await Usuario.gerarHashSenha(senha);

                db.run(`INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)`,
                    [id, nome, email, hash_senha],
                    function(erro) {
                        if (erro) return rejeitar({ status: 500, mensagem: "Erro ao inserir usuário." });
                        resolver({ id, nome, email }); 
                    }
                );
            } catch (erro) {
                rejeitar({ status: 500, mensagem: erro.mensagem || "Erro interno no servidor." });
            }
        });
    }

    /**
     * Busca um usuário pelo e-mail e retorna uma instância da classe.
     * @param {string} email
     * @returns {Promise<Usuario|null>} Instância de Usuario ou null.
     */
    static buscarPorEmail(email) {
        return new Promise((resolver, rejeitar) => {
            db.get(`SELECT * FROM users WHERE email = ?`, [email], (erro, linha) => {
                if (erro) return rejeitar(erro);
                if (!linha) return resolver(null);
                resolver(new Usuario(linha.id, linha.name, linha.email, linha.password_hash));
            });
        });
    }

    /**
     * Gera o hash da senha.
     * @param {string} senha
     * @returns {Promise<string>} Hash da senha.
     */
    static gerarHashSenha(senha) {
        const saltRounds = 10;
        return bcrypt.hash(senha, saltRounds);
    }

    /**
     * Compara a senha fornecida com o hash armazenado.
     * @param {string} senha
     * @returns {Promise<boolean>} True se a senha for válida.
     */
    async compararSenha(senha) {
        return await bcrypt.compare(senha, this.hash_senha); 
    }
}

module.exports = Usuario;