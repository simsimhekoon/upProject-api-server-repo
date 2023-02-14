const express = require("express");
const router = express.Router();

const jwt = require("./JWT");
const { verify } = require("./JWT");
const authJwt = require("./authJWT");

const cookieParser = require("cookie-parser");

const db = require("../../models");
const { User } = db;

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cookieParser());

//로그인 시도
router.post('/signIn', async (req, res) => {
  if (req.cookies.jwt_user) {
    //로그인을 시도했을때 토큰이 있다면 이미로그인되었다고 알리며, 토큰이 만료되었을땐 로그아웃시킨다.
    const token = req.cookies.jwt_user;
    const result = verify(token);

    if (result.ok) {
      console.log("이미 로그인 되어 있습니다.");
      res.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" }); //한글깨짐 방지
      res.write(`<script>alert('이미 로그인 되어 있습니다.')</script>`);
      res.write('<script>window.location="/home"</script>');
    } else {
      if (result.message == "jwt expired") {
        res.clearCookie("jwt_user");
        console.log("토큰 만료로 인해 로그아웃 되었습니다");
        res.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" }); //한글깨짐 방지
        res.write(`<script>alert('토큰 만료로 인해 로그아웃 되었습니다.')</script>`);
        res.write('<script>window.location="/"</script>');
      } else {
        res.status(401).send({
          ok: false,
          message: result.message,
        });
      }
    }
  } else {
    //토큰이 없을때는 바로 로그인
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
      res.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" }); //한글깨짐 방지
      res.write(`<script>alert('로그인성공!!!!!!')</script>`);
      res.write('<script>window.location="/home"</script>');
    } else {
      // res.redirect('/user/login?msg=등록되지 않은 사용자 입니다');
      console.log("등록된 사용자가 아니거나 비밀번호가 틀렸습니다");
      res.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" }); //한글깨짐 방지
      res.write(`<script>alert('등록된 사용자가 아니거나 비밀번호가 틀렸습니다')</script>`);
      res.write('<script>window.location="/"</script>');
    }
  }
});

//로그아웃
router.get('/logOut', async (req, res) => {
  if (req.cookies.jwt_user) {
    res.clearCookie("jwt_user");
    res.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" }); //한글깨짐 방지
    res.write(`<script>alert('로그아웃 되었습니다.')</script>`);
    res.write('<script>window.location="/"</script>');
  } else {
    res.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" }); //한글깨짐 방지
    res.write(`<script>alert('로그인 되어있지 않습니다.')</script>`);
    res.write('<script>window.location="/"</script>');
  }
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
