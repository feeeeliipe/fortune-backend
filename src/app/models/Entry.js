const mongoose = require('mongoose');

const EntryScheme = new mongoose.Schema({
    
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
        type: number, 
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
        required: true    
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Entry = mongoose.model('Entry', EntryScheme);

module.exports = Entry;


