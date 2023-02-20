const express = require('express');
const app = express();

const path = require("path");

app.set("view engine", "ejs");
app.set("views", "./front/views");

app.use(express.static(path.join(__dirname, "front/assets")));

const jwtLoginRouter = require('./route/login/jwtLogin.js');
const signUpRouter = require("./route/login/signUp.js");
const listRouter = require("./route/list/list.js");
const postRouter = require("./route/post/post.js");

app.get('/', (req, res) => { //로그인 화면
    res.render("login");
});

app.get("/home", (req, res) => { //홈 화면
  res.render("home");
});

app.get("/post", (req, res) => { //글 리스트
  res.render("post");
});

app.use("/login/jwtLogin", jwtLoginRouter);
app.use("/login/signUp", signUpRouter);
app.use("/list/list", listRouter);
app.use("/post/post", postRouter);

app.listen(process.env.PORT || 3000, () => {
    console.log('server is listening...');
});

