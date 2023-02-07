const express = require('express');
const app = express();

const loginRouter = require('./route/login.js');
const testRouter = require('./route/test.js');

const db = require('./models');
const { Member } = db;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('URL should contain /api(test) || login/...');
});

app.use('/login', loginRouter);
app.use('/test', testRouter);

app.listen(process.env.PORT || 3000, () => {
    console.log('server is listening...');
});