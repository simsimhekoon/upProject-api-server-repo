const express = require('express');
const app = express();

const jwtLoginRouter = require('./route/login/jwtLogin.js');

app.get('/', (req, res) => {
    res.send('URL should contain /api(test) || login/...');
});

app.use("/login/jwtLogin", jwtLoginRouter);

app.listen(process.env.PORT || 3000, () => {
    console.log('server is listening...');
});