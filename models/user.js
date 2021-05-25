const {Schema, model} = require('mongoose');


const User = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String,required: true},
    roles: [{type: String, ref: 'Role'}]
})
// моделька может легко обновляться, слава богу для монго не нужно писать каждый раз миграции базы

module.exports = model('User', User);
