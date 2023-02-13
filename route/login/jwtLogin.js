const express = require("express");
const router = express.Router();

const jwt = require("./JWT");
const authJwt = require("./authJWT");

const cookieParser = require("cookie-parser");

const db = require("../../models");
const { User } = db;

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cookieParser());

//로그인 시도
router.post('/signIn', async (req, res) => {
    if(req.cookies.jwt_user){
      console.log("이미 로그인 되어 있습니다.");
      res.redirect("http://localhost:8000");
    } else{
      const { userId, pw } = req.body;
      const [user] = await User.findAll({ where: { userId, pw } });
      if (user) {
        console.log("로그인 되었습니다");
        const payload = {
          num: user.id,
          id: user.userId,
          name: user.name,
        };

        const token = jwt.createToken(payload);

        // set cookie
        res.cookie("jwt_user", token, { httpOnly: true });
        res.redirect("http://localhost:8000");
      } else {
        // res.redirect('/user/login?msg=등록되지 않은 사용자 입니다');
        console.log("등록된 사용자가 아니거나 비밀번호가 틀렸습니다");
      }
    }
});

//로그아웃
router.get('/logOut', async (req, res) => {
    if(req.cookies.jwt_user){
      res.clearCookie("jwt_user");
      console.log("로그아웃 되었습니다");
    } else {
      console.log("로그인 되어있지 않습니다.");
    }

    res.redirect("http://localhost:8000");
});

//jwt요청 ex -> profile불러오기
router.get('/profile', authJwt, async (req, res) => {
  console.log("유효성 검사 성공");
  const id = req.num;
  const editProfile = await User.findOne({ where: { id } });

  res.send({
    editProfile,
    message: "profile access success!",
  });
});


module.exports = router;
