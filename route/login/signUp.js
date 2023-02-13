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

//유저 리스트 보기
router.get("/members", async (req, res) => {
  const { id } = req.query;
  if (id) {
    const teamMembers = await User.findAll({ where: { id } });
    res.send(teamMembers);
  } else {
    const members = await User.findAll();
    res.send(members);
  }
});

//회원가입
router.post("/signUp", async (req, res) => {
  const newUser = req.body;
  const userId = newUser.userId;
  const [currentMember] = await User.findAll({ where: { userId } });
  console.log(currentMember);
  if(!currentMember){
    const user = User.build(newUser);
    await user.save();
    console.log("회원가입 되었습니다.");
  } else {
    console.log("이미 있는 사용자입니다.");
  }

  res.redirect("http://localhost:8000");
});

//회원탈퇴
router.get("/delete", authJwt, async (req, res) => {
  console.log("유효성 검사 성공");

  const id = req.num;
  const deletedCount = await User.destroy({ where: { id } });

  if (deletedCount) {
    res.send({ message: `${deletedCount} row(s) Deleted!!` });
  } else {
    res.status(404).send({ message: "there is no id" });
  }
});

module.exports = router;
