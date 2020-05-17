
const express = require('express');
const router = express.Router();

router.post('/register', async (req, res) => {

});

router.get('/users', async (req, res) => {
    return res.send('Funfou');
});

module.exports = app => {
    app.use('/auth', router);
}