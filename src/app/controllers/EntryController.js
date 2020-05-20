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
        // Cria o objeto de filtros e adiciona o usuário da requisição
        let filters = {};
        filters.user = req.userId;

        // Fitro por data de vencimento 
        const { dueDate } = req.query;
        if(dueDate) {
            dates = dueDate.split(',');
            // Se tem duas datas no filtro
            if(dates.length === 2) {
                filters.dueDate = {};
                filters.dueDate.$gte = new Date(dates[0]);
                filters.dueDate.$lte = new Date(new Date(dates[1]).setUTCHours(23, 59, 59));
            } else {
                filters.dueDate = {};
                filters.dueDate.$gte = new Date(dueDate);
            }
        }
        
        const entries = await Entry.find( filters ).populate('category');
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