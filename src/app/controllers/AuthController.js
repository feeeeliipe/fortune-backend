
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bc = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');

function generateJwt(userId) {
    const token = jwt.sign({ id: userId }, authConfig.secret, {
        expiresIn: 7200
    });
    return token;
}

router.post('/register', async (req, res) => {
    try {
        const { email } = req.body;
        const userWithSameEmail = await User.findOne({ email });
        if(userWithSameEmail) {
            return res.status(400).send({ error: 'User already exists with this e-mail.'});
        }
        const user = await User.create(req.body);
        return res.send(user);
    } catch (error) {
        return res.status(500).send({ error: 'Error creating user.' });
    }
});

router.post('/authenticate', async (req, res) => {
    try {
        const { email, password } = req.body;       
        if(!email)
            return res.status(400).send({ error: 'E-mail not provided.' });
        if(!password)
            return res.status(400).send({ error: 'Password not provided.' });
        
        // Busca o usuário pelo e-mail informado 
        const user = await User.findOne({ email }).select('password');
        // Valida se a senha informada esta correta 
        if(!await bc.compare(password, user.password)) {
            return res.status(401).send({ error: 'Invalid password.' });
        }
        // Gera token de autenticação 
        const token = generateJwt(user._id);
        return res.send({user, token});
    } catch (error) {
        return res.status(500).send({ error: 'Error on authenticate.' });
    }
});

module.exports = app => {
    app.use('/auth', router);
}