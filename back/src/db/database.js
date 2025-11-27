const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:', (erro) => {
    if (erro) {
        console.error("Erro ao abrir o banco de dados: " + erro.message);
    } else {
        console.log('Banco de dados SQLite em memória inicializado.');
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                name TEXT,
                email TEXT UNIQUE,
                password_hash TEXT
            );
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS todos (
                id TEXT PRIMARY KEY,
                user_id TEXT,
                description TEXT,
                priority TEXT, 
                deadline INTEGER,
                completed INTEGER DEFAULT 0,
                created_at INTEGER,
                completed_at INTEGER,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        `);
    }
});

module.exports = db;