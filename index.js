const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./auth_router');
const PORT = process.env.PORT || 8800;

const app = express();

app.use(express.json());
app.use('/auth',authRouter); // для авторизации свой роутер, чтоб миддлвари удобнее подключать было и не путаться

const start = async () => {
    try {
        await mongoose.connect(`mongodb+srv://dbAdmin:qwerty123@cluster0.ll8jo.mongodb.net/course_project?retryWrites=true&w=majority`);
        app.listen(PORT, () => {
         console.log(`===================== \n  Start on port ${PORT} \n=====================`);
        })
    } catch (e){
        console.log(e);
    }
}

// стандартная инициализаиция, но async await, потому что mongo требует, да и вообще это модно


start().then(r => console.log('===================== \n       SUCCESS'));
