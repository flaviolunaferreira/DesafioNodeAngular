const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

const autenticarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401); 
    }

    jwt.verify(token, JWT_SECRET, (erro, usuario) => {
        if (erro) {
            return res.sendStatus(403); 
        }
        
        req.userId = usuario.id; 
        next();
    });
};

module.exports = autenticarToken;
