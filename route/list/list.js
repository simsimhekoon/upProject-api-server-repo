const express = require("express");
const router = express.Router();

const authJwt = require("../login/authJWT");

const cookieParser = require("cookie-parser");

const db = require("../../models");
const { User } = db;
const { RefreshToken } = db;

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cookieParser());


router.get("/getList", authJwt, async (req, res) => {
  console.log("유효성 검사 성공");
  const getLists = await User.findAll({attributes: ['id','userId','name','emailAddress']});

  res.render("list", { lists: getLists });
});


module.exports = router;