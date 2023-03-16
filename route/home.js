const express = require("express");
const router = express.Router();

const getImageData = require("./postJoin/imgGetMw.js");

const { Op } = require("sequelize");

const db = require("../models");
const { PostJoin } = db;
const { PostImg } = db;

router.use(express.json());

router.get("/", async (req, res) => {
  //홈 화면
  const nowDate = new Date();
  const recommend = await PostJoin.findAll({
    where: {
      period: {
        [Op.gt]: nowDate,
      },
    },
    order: [["period", "ASC"]],
    limit: 3,
  });

  if (recommend.length < 3) {
    const recommend2 = await PostJoin.findAll({
      where: {
        period: {
          [Op.lte]: nowDate,
        },
      },
      order: [["period", "DESC"]],
      limit: 3 - recommend.length,
    });

    recommend.push(...recommend2);
  }

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
        imgUrl[i] = await getImageData.getNoImg();
    }
    
  }

  res.render("home", { imgUrl: imgUrl, data: recommend });
});


module.exports = router;
