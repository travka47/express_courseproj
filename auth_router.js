const Router = require('express');
const router = new Router();
const controller = require('./auth_controller');
const {check} = require('express-validator');
const authMiddleware = require('./middlewares/authMiddle');
const roleMiddleware = require('./middlewares/roleMiddle');

router.post('/register',[
    check('username','Username invalid(empty)').notEmpty(),
    check('password', 'Password length must be greater than 8 and less 16 symbols')
        .isLength({min: 8, max: 16})
],controller.registration); // до передачи запроса в контроллер, делаю валидацию на пустоту и длину стандартными методами, можно еще чего нибудь модного добавить
router.post('/login', controller.login);
router.get('/users', authMiddleware,controller.usersGetter); // тест миддлвари для доступа только авторизованных пользователей

module.exports = router
