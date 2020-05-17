const express = require('express');
const authMiddleware = require('../middlewares/AuthMiddleware');
const Category = require('../models/Category');

const router = express.Router();

// Define que o controle usa o middleware de autenticação para as rotas
router.use(authMiddleware);

// Cria uma categoria
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
        const categoryWithSameName = await Category.findOne({ name });      
        if(categoryWithSameName) {
            return res.status(400).send({ error: 'Category already exists with this name.'})
        }

        const category = await Category.create(req.body);
        return res.status(201).send(category);

    } catch (error) {
        return res.status(500).send({ error: 'Internal server error.' });
    }
})

// Altera uma categoria 
router.put('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(200).send(category);

    } catch (error) {
        return res.status(500).send({ error: 'Internal server error.' });
    }
});

// Deleta uma categoria 
router.delete('/:id', async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        return res.status(204).send();
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Internal server error.' });
    }
});

// Retorna todas as categorias 
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        return res.send({categories});    
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Internal server error.' });
    }
});

module.exports = app => {
    app.use('/categories', router);
};