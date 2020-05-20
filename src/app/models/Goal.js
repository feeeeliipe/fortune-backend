const mongoose = require('mongoose');

const GoalScheme = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    initialDate: {
        type: Date, 
        required: true
    },
    finalDate: {
        type: Date,
        required: true
    },
    expectedAmount: {
        type: Number, 
        required: true,
    },
    installmentsQuantity: {
        type: Number, 
        required: false
    },
    installmentsValue: {
        type: Number, 
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Goal = mongoose.model('Goal', GoalScheme);

module.exports = Goal;


