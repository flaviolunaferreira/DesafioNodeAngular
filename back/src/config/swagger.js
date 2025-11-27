const swaggerJsdoc = require('swagger-jsdoc');
const { PORT } = require('./config');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API TO-DO',
            version: '1.0.0',
            description: 'API REST com CRUD completo, autenticação JWT e métricas para o desafio Frontend Angular.',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Servidor Local',
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Token JWT de acesso.',
                },
            },
            schemas: {
                UserRegister: {
                    type: 'object',
                    properties: {
                        nome: { type: 'string', example: 'João Silva' },
                        email: { type: 'string', format: 'email', example: 'joao.silva@teste.com' },
                        senha: { type: 'string', example: 'SenhaForte123' },
                    },
                    required: ['nome', 'email', 'senha'],
                },
                UserLogin: {
                    type: 'object',
                    properties: {
                        email: { type: 'string', format: 'email', example: 'joao.silva@teste.com' },
                        senha: { type: 'string', example: 'SenhaForte123' },
                    },
                    required: ['email', 'senha'],
                },
                Todo: {
                    type: 'object',
                    properties: {
                        descricao: { type: 'string', example: 'Finalizar componente de lista' },
                        prioridade: { type: 'string', enum: ['Alta', 'Média', 'Baixa'], example: 'Alta' },
                        prazo: { type: 'integer', nullable: true, description: 'Timestamp UNIX opcional (milisegundos)', example: 1672531200000 }
                    },
                    required: ['descricao', 'prioridade'],
                },
                TodoStatusUpdate: {
                    type: 'object',
                    properties: {
                        concluida: { type: 'boolean', description: 'True para marcar como concluída, False para pendente.', example: true }
                    },
                    required: ['concluida'],
                }
            },
        },
    },
    apis: ['./src/routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;