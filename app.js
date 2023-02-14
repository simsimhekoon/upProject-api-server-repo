const express = require('express');
const app = express();

const path = require("path");

app.set("view engine", "ejs");
app.set("views", "./front/views");

app.use(express.static(path.join(__dirname, "front/assets")));

const jwtLoginRouter = require('./route/login/jwtLogin.js');
const signUpRouter = require("./route/login/signUp.js");

app.get('/', (req, res) => { //로그인 화면
    res.render("login");
});

app.get("/home", (req, res) => { //홈 화면
  res.render("home");
});

app.use("/login/jwtLogin", jwtLoginRouter);
app.use("/login/signUp", signUpRouter);

app.listen(process.env.PORT || 3000, () => {
    console.log('server is listening...');
});