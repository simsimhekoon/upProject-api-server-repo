const express = require("express");
const router = express.Router();

const getImageData = require("./postJoin/imgGetMw.js");

const db = require("../models");
const { PostJoin } = db;
const { PostImg } = db;

router.use(express.json());

router.get("/", async (req, res) => {
  //홈 화면
  const recommend = await PostJoin.findAll({
    order: [["period", "DESC"]],
    offset: 0,
    limit: 3,
    attributes: ["id"],
  });

  let postId;
  let imsi;
  let imgUrl = [];
  for(let i = 0; i < recommend.length; i++){
    postId = recommend[i].id;
    imsi = await PostImg.findOne({
        attributes: ["img"],
        where: { postId },
    });

    if(imsi){
        imgUrl[i] = await getImageData.getImageData(postId);
    } else {
        imgUrl[i] = process.env.NOIMG;
    }
    
  }

  res.render("home", { imgUrl: imgUrl });
});


module.exports = router;
