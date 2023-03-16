const express = require("express");
const router = express.Router();

const jwt = require("./JWT");
const { verify } = require("./JWT");
const authJwt = require("./authJWT");

const cookieParser = require("cookie-parser");

const db = require("../../models");
const { User } = db;
const { RefreshToken } = db;

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cookieParser());

//로그인 시도
router.post('/signIn', async (req, res) => {
  console.log("로그인을 시도합니다.");
  if (req.cookies.jwt_user) {
    //로그인을 시도했을때 토큰이 있다면 이미로그인되었다고 알리며, 토큰이 만료되었을땐 로그아웃시킨다.
    const token = req.cookies.jwt_user;
    const result = verify(token);

    if (result.ok) {
      console.log("이미 로그인 되어 있습니다.");
      res.send("<script>alert('이미 로그인 되어 있습니다.');location.href='/home';</script>");
    } else {
      if (result.message == "jwt expired") {
        res.clearCookie("jwt_user");
        res.clearCookie("jwt_ref");
        const token = req.cookies.jwt_ref;
        await RefreshToken.destroy({ where: { token } });
        console.log("토큰 만료로 인해 로그아웃 되었습니다");
        res.send("<script>alert('토큰 만료로 인해 로그아웃 되었습니다.');location.href='/';</script>");
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
      const payload = {
        num: user.id,
        id: user.userId,
        name: user.name,
      };

      const token = jwt.createToken(payload);
      const refreshToken = jwt.createRefresh();

      // set cookie
      res.cookie("jwt_user", token, { httpOnly: true });
      res.cookie("jwt_ref", refreshToken, { httpOnly: true });

      // refresh save
      const buildRefresh = {
        userId: user.userId,
        token: refreshToken,
      };

      const refreshSave = RefreshToken.build(buildRefresh);
      await refreshSave.save();

      console.log("로그인 되었습니다");
      res.send("<script>alert('로그인 성공!!!');location.href='/home';</script>");
    } else {
      console.log("등록된 사용자가 아니거나 비밀번호가 틀렸습니다");
      res.send("<script>alert('등록된 사용자가 아니거나 비밀번호가 틀렸습니다.');location.href='/';</script>");
    }
  }
});

//로그아웃
router.get('/logOut', async (req, res) => {
  if (req.cookies.jwt_user) {
    let token = req.cookies.jwt_user; // header에서 access token을 가져옵니다.
    token = req.cookies.jwt_ref;
    const deletedRefresh = await RefreshToken.destroy({ where: { token } });
    res.clearCookie("jwt_user");
    res.clearCookie("jwt_ref");

    res.send(
      "<script>alert('로그아웃 되었습니다.');location.href='/';</script>"
    );
  } else {
    res.send("<script>alert('로그인 되어있지 않습니다.');location.href='/';</script>");
  }
});


module.exports = router;
