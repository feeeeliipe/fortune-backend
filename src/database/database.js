const mongoose = require('mongoose');

mongoose.connect(
    'mongodb+srv://system:5p39G4GOYJ0YogrC@fortune-db-njahs.mongodb.net/fortune',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    });
mongoose.Promise = global.Promise;

module.exports = mongoose;