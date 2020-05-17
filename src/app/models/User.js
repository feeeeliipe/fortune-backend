const mongoose = require('mongoose');
const bc = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String, 
        required: true,
        select: false
    },
    autoEffectuateEntries: {
        type: Boolean, 
        required: true, 
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save', async function(next) {
    const hash = await bc.hash(this.password, 10);
    this.password = hash;

    next();
})

const User = mongoose.model('User', UserSchema);

module.exports = User;