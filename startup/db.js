const winston  = require('winston');
const mongoose = require('mongoose');

module.exports = function()
{
    mongoose.connect(process.env.DB_URI_ATLAS, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify:false
    })
    .then(()=>winston.info('Connected to MongoDb'));
}