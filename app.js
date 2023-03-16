const express = require('express');
const app = express();

const path = require("path");

app.set("view engine", "ejs");
app.set("views", "./front/views");

app.use(express.static(path.join(__dirname, "front/assets")));

const jwtLoginRouter = require('./route/login/jwtLogin.js');
const homeRouter = require("./route/home.js");
const signUpRouter = require("./route/login/signUp.js");
const postRouter = require("./route/post/post.js");
const postJoinRouter = require("./route/postJoin/post.js");
const commentRouter = require("./route/post/comment.js");

app.get('/', (req, res) => { //로그인 화면
    res.render("login");
});

app.use("/login/jwtLogin", jwtLoginRouter);
app.use("/home", homeRouter);
app.use("/login/signUp", signUpRouter);
app.use("/post/post", postRouter);
app.use("/post/postJoin", postJoinRouter);
app.use("/post/comment", commentRouter);


app.listen(process.env.PORT || 3000, () => {
    console.log('server is listening...');
});

