const jwt = require('jsonwebtoken');
const {secret} = require('../config');

module.exports = (req, res, next) => {
    if (req.method === "OPTIONS") {
        next();
    }

    try {
        const token = req.headers.authorization.split(' ')[1]; // костыль, надо исправить
        if (!token) {
            return res.status(403).json({message: 'User is not authorised'}) // юзер лох
        }
        req.user = jwt.verify(token, secret); // просто чекаем есть все ли норм вообще у чела, как семья, кот поживает
        next();
    } catch (e) {
        console.log(e);
        return res.status(403).json({message: 'User is not authorised'});
    }
};
