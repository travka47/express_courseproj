const User = require('./models/user');
const Role = require('./models/roles');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');
const {secret} = require('./config');

const generateToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"});
} // стандартная генерация jwt токена спи жена с документации

class authController{
    async registration(req, res) {
        try {
            const errors = validationResult(req); // если валидатор отдал проблемы, кидаем ошибку в ответ и сообщаем ошибки
            if (!errors.isEmpty()){
                return res.status(400).json({message: 'invalid data', errors});
            }
            const {username, password} = req.body; // вытягиваем с запроса данные
            const candidate = await User.findOne({username}); // пытаемся найти пользователя в бд
            if (candidate) {
                return res.status(400).json({message: 'Username is already exists'}); // если есть, то возварщаем ошибку
            }
            const passwordHash = bcrypt.hashSync(password, 5); // шифруем пароль для добавления в бд
            const userRole = await Role.findOne({value: 'user'}); // находим роль для добавления
            const user = new User({username, password: passwordHash, roles: [userRole.value]}); // создаем объект модели для добавления в бд
            await user.save(); // сохраняем
            return res.json({message: 'Register success'}); // кидаем успех
        }catch(e) {
            console.log(e); // стандартная обработка ошибок
            res.status(400).json({message: 'Reg error , check data'});
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body; // распаковываем данные с запроса
            const user = await User.findOne({username}); // пытаемся найти в бд по юзернейму
            if (!user) {
                return res.status(400).json({message: `user ${username} is doesn't exist`}); // если юзера нет, кидаем ошибку
            }
            const validPassword = bcrypt.compareSync(password, user.password); // расшифровываем пароль
            if (!validPassword) {
                return res.status(400).json({message: 'invalid password'}); // если не валид, кидаем ошибку
            }
            const token = generateToken(user._id, user.roles); // генерируем токен для этого юзера
            return res.json({token}); // успех, возвращаем ответом токен
        }catch(e) {
            console.log(e); // стандартная обработка ошибок
            res.status(400).json({message: "Login error , check data"});
        }
    }

    async usersGetter(req, res) {
        try {
            const users = await User.find(); // вытягиваем с монго всех юзеров
            res.json(users); // и возвращаем их
        }catch(e) {
            console.log(e); // ну а если не возвращаем, то смысл жить тогда
            res.status(400).json({message: 'GG WP'});
        }
    }
}

module.exports = new authController(); // эскпортируем всю эту пьянку
