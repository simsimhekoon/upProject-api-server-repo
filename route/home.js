const express = require("express");
const router = express.Router();

const db = require("../models");
const { Member } = db;

router.use(express.json());

router.get("/", (req, res) => {
  //홈 화면
  res.render("home");
});


module.exports = router;
