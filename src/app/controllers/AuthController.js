const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bc = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

function generateJwt(userId) {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: 14400
    });
    return token;
}

router.post('/register', async (req, res) => {
    try {
        const { email } = req.body;
        const userWithSameEmail = await User.findOne({ email });
        if(userWithSameEmail) {
            return res.status(400).send({ error: 'Já existe um usuário com esse endereço de e-mail'});
        }
        const user = await User.create(req.body);
        const token = generateJwt(user._id);
        // Retira a senha do retorno 
        user.password = undefined;
        
        return res.send({user, token});
    } catch (error) {
        return res.status(500).send({ error: 'Erro ao criar usuário' });
    }
});

router.post('/authenticate', async (req, res) => {
    try {
        const { email, password } = req.body;       
        if(!email)
            return res.status(400).send({ error: 'E-mail não informado.' });
        if(!password)
            return res.status(400).send({ error: 'Senha não informada.' });
        
        // Busca o usuário pelo e-mail informado 
        const user = await User.findOne({ email }).select('name email password');
        if(!user) {
            return res.status(400).send({ error : 'Usuário não encontrado.'});
        }

        // Valida se a senha informada esta correta 
        if(!await bc.compare(password, user.password)) {
            return res.status(401).send({ error: 'Senha inválida.' });
        }

        // Gera token de autenticação 
        const token = generateJwt(user._id);
        
        // Retira a senha do retorno 
        user.password = undefined;
        
        return res.send({user, token});
    } catch (error) {
        return res.status(500).send({ error: 'Error on authenticate.' });
    }
});

module.exports = app => {
    app.use('/auth', router);
}