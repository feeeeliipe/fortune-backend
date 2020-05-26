const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if(!authHeader){ 
        return res.status(401).send({ error: 'No token provided.'});
    }

    // Valida a estrutura do token enviado 
    const parts = authHeader.split(' ');
    if(!parts.length === 2) {
        return res.status(401).send({ error: 'Invalid token'});
    }
    const [ scheme, token ] = parts;
    if(!/^Bearer$/i.test(scheme)) {
        return res.status(401).send({ error: 'Token malformatted'});
    }
    
    // Verifica se o token é valido 
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) {
            return res.status(401).send({ error: 'Invalid token'} );
        }

        req.userId = decoded.id;
        return next();
    });
}