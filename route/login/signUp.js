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

//회원가입
router.post("/signUp", async (req, res) => {
  const newUser = req.body;
  const userId = newUser.userId;
  const [currentMember] = await User.findAll({ where: { userId } });
  console.log(currentMember);
  if(!currentMember){
    const user = User.build(newUser);
    await user.save();
    res.send("<script>alert('회원가입 되었습니다.');location.href='/';</script>");
  } else {
    res.send("<script>alert('이미 있는 사용자입니다.');location.href='/';</script>");
  }
});

//회원탈퇴
router.get("/delete", authJwt, async (req, res) => {
  console.log("유효성 검사 성공");

  const id = req.num;
  const deletedCount = await User.destroy({ where: { id } });

  res.clearCookie("jwt_user");

  if (deletedCount) {
    res.send("<script>alert('회원 탈퇴 되었습니다.');location.href='/';</script>");
  } else {
    res.send("<script>alert('존재하지 않는 사용자 입니다.');location.href='/';</script>");
  }
});

module.exports = router;
