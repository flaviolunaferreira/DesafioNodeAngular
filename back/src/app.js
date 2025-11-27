// src/app.js

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const { PORT } = require('./config/config');
const swaggerSpec = require('./config/swagger'); 

// Inicializa o DB e cria as tabelas
require('./db/database'); 

// Importa Rotas
const authRoutes = require('./routes/auth.routes');
const todoRoutes = require('./routes/todo.routes');

const app = express();

// Middlewares
app.use(cors()); 
app.use(express.json()); // Habilita JSON

// Rota de Documentação
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas da Aplicação
app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);

app.get('/', (req, res) => {
    res.send('API TO-DO Rodando! Acesse /api-docs para documentação.');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});