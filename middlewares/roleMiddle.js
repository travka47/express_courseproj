const jwt = require('jsonwebtoken');
const {secret} = require('../config');

module.exports = (roles) => {
    return (req, res, next) => {
        if (req.method === "OPTIONS") {
            next();
        }

        try {
            const token = req.headers.authorization.split(' ')[1]; // вытягиваем сам токен из заголовка
            if (!token) {
                return res.status(403).json({message: 'User is not authorized'}); // если токена нет - юзер лох
            }
            const {roles: userRoles} = jwt.verify(token, secret); // проверяем по токену роли юзера
            let access = false; //флаг доступа
            userRoles.forEach(role => {
                if (roles.includes(role)) {
                    access = true;
                    // проверяем нужные роли
                }
            });
            if (!access) {
                return res.status(403).json({message: 'Permission denied'}); // если не нашли соответствие ролей - кидаем ошибку
            }
            next();
        } catch (e) {
            console.log(e); // стандартная обработка ошибок
            return res.status(403).json({message: 'User is not authorized'})
        }
    }
};
