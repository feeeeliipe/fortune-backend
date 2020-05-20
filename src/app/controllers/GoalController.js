const express = require('express');
const authMiddleware = require('../middlewares/AuthMiddleware');
const Goal = require('../models/Goal');
const Entry = require('../models/Entry');

const router = express.Router();

// Define que o controle usa o middleware de autenticação para as rotas
router.use(authMiddleware);

function calculateInstallments(goal) {
    const totalValue = goal.expectedAmount;
    const initialDate = new Date(goal.initialDate);
    const finalDate = new Date(goal.finalDate);

    let monthsDiference;
    monthsDiference = (finalDate.getFullYear() - initialDate.getFullYear()) * 12;
    monthsDiference -= initialDate.getMonth();
    monthsDiference += finalDate.getMonth();
    monthsDiference = monthsDiference <= 0 ? 0 : monthsDiference;

    goal.installmentsQuantity = monthsDiference;
    goal.installmentsValue = Math.ceil(totalValue / monthsDiference);
    
    return goal;
}

function generateInstallments(goalToGenerate) {
    installment = 1;
    dueDate = new Date(goalToGenerate.initialDate);
    while (goalToGenerate.installmentsQuantity >= installment) {
        let entry = new Entry();
        
        entry.user = goalToGenerate.user;
        entry.description = `Parcela ${installment} (${goalToGenerate.description})`;
        entry.longDescription = `Lançamento automático gerado pela meta (${goalToGenerate.description})`;
        entry.type = 'investiment';
        entry.amount = goalToGenerate.installmentsValue;
        entry.dueDate = dueDate
        entry.paidDate = null;
        entry.paid = false;
        entry.goal = goalToGenerate._id;
        entry.save();

        installment++;    
        dueDate = new Date(dueDate.setMonth(dueDate.getMonth()+1));
    }
}

// Gera parcelas da meta
router.post('/generateInstallments/:id', async(req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        generateInstallments(goal);
        return res.send(goal);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Internal server eror' });
    }    
})

// Cadastra uma meta
router.post('/', async (req, res) => {
    try {
        let goal = calculateInstallments(req.body);
        goal.user = req.userId;
        const newGoal = await Goal.create(goal);
        return res.send(newGoal);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Internal server eror' });
    }
});

// Altera uma meta
router.put('/:id', async(req, res) => {
    try {
        let goal = calculateInstallments(req.body);
        const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, goal, { new: true });
        return res.send(updatedGoal);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Internal server eror' });
    }
});

// Deleta uma meta
router.delete('/:id', async(req, res) => {
    try {
        // Implementa validação para não deixar excluir uma meta com lançamentos 
        
        await Goal.findByIdAndDelete(req.params.id);
        return res.status(204).send();
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Internal server eror' });
    }
})

// Busca meta por id 
router.get('/:id', async(req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        return res.send(goal);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Internal server eror' });
    }
})

// Busca todas as metas do usuário 
router.get('/', async(req, res) => {
    try {
        const goals = await Goal.find( { user: req.userId} );    
        return res.send(goals);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Internal server eror' });
    }
})

module.exports = app => {
    app.use('/goals', router);
}