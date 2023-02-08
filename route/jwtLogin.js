const express = require("express");
const router = express.Router();

const cookieParser = require("cookie-parser");

const db = require("../models");
const { User } = db;

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cookieParser());

require("dotenv").config();
const jwt = require("jsonwebtoken");

////////jwt를 위한 세팅
const secretKey = process.env.SECRET_KEY;
const algorithm = process.env.JWT_ALG;
const expiresIn = process.env.JWT_EXP;

const option = {algorithm, expiresIn};

function createToken(payload) {
    return jwt.sign(payload, secretKey, option);
}

function decodeToken(token) {
  return jwt.verify(token, secretKey);
}
////////


//로그인 시도
router.post('/signIn', async (req, res) => {
    const { userId, pw } = req.body;
    const [user] = await User.findAll({ where: { userId, pw } });
    if(user){
      console.log("로그인 되었습니다");
      const payload = {
        num: user.id,
        id: user.userId,
        name: user.name,
      };

      const token = createToken(payload);
      // // 토큰정보 확인
      console.log(token);
      // const decodeResult = decodeToken(token);
      // console.log(decodeResult);

      // set cookie
      res.cookie("user", token, {httpOnly: true,});

      res.redirect("http://localhost:8000");
    //   res.send(`${token}`);
    }else{
        // res.redirect('/user/login?msg=등록되지 않은 사용자 입니다');
        console.log("등록된 사용자가 아니거나 비밀번호가 틀렸습니다");
    }
});

//로그아웃
router.get('/logOut', async (req, res) => {
    res.clearCookie("user");
    res.redirect("http://localhost:8000");
});


module.exports = router;
