const express = require('express');
const app = express();

const path = require("path");

app.set("view engine", "ejs");
app.set("views", "./front/views");

app.use(express.static(path.join(__dirname, "front/assets")));

//test용 라우트입니다. 나중에 삭제!
const TEST = require("./route/testRoute/test.js");

const jwtLoginRouter = require('./route/login/jwtLogin.js');
const signUpRouter = require("./route/login/signUp.js");
const listRouter = require("./route/list/list.js");
const postRouter = require("./route/post/post.js");
const commentRouter = require("./route/post/comment.js");

app.get('/', (req, res) => { //로그인 화면
    res.render("login");
});

app.get("/home", (req, res) => { //홈 화면
  res.render("home");
});

app.get("/post", (req, res) => { //글 리스트
  res.render("post");
});

app.use("/testRoute/test", TEST);

app.use("/login/jwtLogin", jwtLoginRouter);
app.use("/login/signUp", signUpRouter);
app.use("/list/list", listRouter);
app.use("/post/post", postRouter);
app.use("/post/comment", commentRouter);

app.get("/imgTest", (req, res) => {
  res.render("imgtest");
});

app.listen(process.env.PORT || 3000, () => {
    console.log('server is listening...');
});

