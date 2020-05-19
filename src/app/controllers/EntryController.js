const express = require('express');
const authMiddleware = require('../middlewares/AuthMiddleware');
const Entry = require('../models/Entry');

const router = express.Router();

// Define que o controle usa o middleware de autenticação para as rotas
router.use(authMiddleware);

// Insere um lançamento 
router.post('/', async (req, res) => {
    try {
        let entry = req.body;
        entry.user = req.userId;
        const newEntry = await Entry.create(entry);
        return res.send(newEntry);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Internal server error.' });
    }
});

// Altera um lançamento
router.put('/:id', async(req, res) => {
    try {
        const entry = await Entry.findByIdAndUpdate(req.params.id, req.body);
        return res.send(entry);    
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Internal server error.' });    
    }
})

// Exclui um lançamento
router.delete('/:id', async (req, res) => {
    try {
        await Entry.findByIdAndDelete(req.params.id);
        return res.status(204).send();
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Internal server error.' });    
    }    
})

// Lista todos os lançamentos do usuário
router.get('/', async(req, res) => {
    try {
        const userId = req.userId;
        const entries = await Entry.find( { user : userId} ).populate('category');
        return res.send(entries);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Internal server error.' });
    }
})

// Lista um lançamento por id
router.get('/:id', async (req, res) => {
    try {
        const entryId = req.params.id;
        const entry = await Entry.findById(entryId).populate('category');
        return res.send(entry);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Internal server error.' });
    }
})

module.exports = app => {
    app.use('/entries', router);
}