const express = require('express');
const app = express();

const jwtLoginRouter = require('./route/login/jwtLogin.js');
const signUpRouter = require("./route/login/signUp.js");

app.get('/', (req, res) => {
    res.send('URL should contain /api(test) || login/...');
});

app.use("/login/jwtLogin", jwtLoginRouter);
app.use("/login/signUp", signUpRouter);

app.listen(process.env.PORT || 3000, () => {
    console.log('server is listening...');
});