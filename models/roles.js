const {Schema, model} = require('mongoose');


const Role = new Schema({
    value: {type: String, unique: true, default: 'user'}, // инициализируем модельку ролей простую, можно сделать ее круче
})

module.exports = model('Role', Role);
