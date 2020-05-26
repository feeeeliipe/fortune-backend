const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: false } ));
app.use(cors());

// Inicializa a conexão com o banco
require('./database/database');

// Importa os controllers da aplicação 
require('./app/controllers/AuthController')(app);
require('./app/controllers/CategoryController')(app);
require('./app/controllers/EntryController')(app);
require('./app/controllers/GoalController')(app);

app.listen(3001, () => {
    console.log('Server is running');
})