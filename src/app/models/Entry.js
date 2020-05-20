const mongoose = require('mongoose');

const EntryScheme = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    longDescription: {
        type: String, 
        required: false
    }, 
    type: {
        type: String, 
        required: true
    }, 
    amount: {
        type: Number, 
        required: true,
    },
    dueDate: {
        type: Date, 
        default: new Date()
    }, 
    paidDate: {
        type: Date
    },
    paid: {
        type: Boolean, 
        required: true
    }, 
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: false    
    },
    goal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Goal', 
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Entry = mongoose.model('Entry', EntryScheme);

module.exports = Entry;


