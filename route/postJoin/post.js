const express = require("express");
const router = express.Router();

const authJwt = require("../login/authJWT");

const cookieParser = require("cookie-parser");

const { upload } = require("./imgPostMw.js");
const getImageData = require("./imgGetMw.js");
const imgDelete = require("./imgDeleteMw.js");

const db = require("../../models");
const { PostJoin } = db;
 const { JoinMember } = db;
 const { PostImg } = db;

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cookieParser());

//게시판 글 목록
router.get("/getPostList/:page", authJwt, async (req, res) => {
  const currentPage = parseInt(req.params.page);
  const postList = await PostJoin.findAll(
    {
      order: [["id", "DESC"]],
      offset: currentPage * 5 - 5,
      limit: 5,
    },
  );
  const allPage = await PostJoin.findAll();

  //모집현황 생성
  let joinCount = [];
  let postId;
  for(let i = 0; i < postList.length; i++){
    postId = postList[i].id;
    if(postId){
      joinCount[i] = await JoinMember.findAndCountAll({ where: { postId } });
    }
  }


  if(postList.length == 0){ //게시글이 하나도 없는경우
    res.render("./postJoin/post", { postList: "", date: "", allPage: 0, currentPage: 1 });
  } else {
    res.render("./postJoin/post", {
      postList: postList,
      allPage: allPage.length,
      currentPage: currentPage,
      joinCount: joinCount
    });
  }
});

//글 쓰러가기
router.get("/goToWrite", authJwt, async (req, res) => {
  const name = req.name;
  res.render("./postJoin/write", { name: name });
});

//글쓰기
router.post("/write", authJwt, upload.single("image"), async (req, res) => {
  const newPost = {
    userId: req.id,
    name: req.name,
    title: req.body.title,
    subtitle: req.body.subtitle,
    place: req.body.place,
    content: req.body.content,
    ps: req.body.ps,
    date: req.body.date,
    period: req.body.period,
    limit: req.body.limit,
    confirm: req.body.confirm,
  };
  const post = PostJoin.build(newPost);
  await post.save();

  if (req.fileName) {
    const newImg = {
      img: req.fileName,
      postId: post.id,
    };
    const comment = PostImg.build(newImg);
    await comment.save();
  }

  res.send(
    "<script>alert('작성되었습니다.');location.href='/post/postJoin/getPostList/1';</script>"
  );
});

//글 보기
router.get("/view", authJwt, async (req, res) => {
  const id = req.query.id;
  const num = req.query.num;

  //본문처리
  const post = await PostJoin.findOne({
    where: { id },
  });

  //날짜 처리
  let createdDate = post.createdAt.toISOString();
  const date = createdDate.substr(0, 10);
  createdDate = post.date.toISOString();
  const dateValue = createdDate.substr(0, 10);
  createdDate = post.period.toISOString();
  const period = createdDate.substr(0, 10);
  createdDate = post.confirm.toISOString();
  const confirm = createdDate.substr(0, 10);

  const dateValues = {
    "date": dateValue,
    "period": period,
    "confirm": confirm
  };  

  const postId = id;
  //모집현황 처리
  const joinMembers = await JoinMember.findAll({ attributes: ["name"], where: { postId } });

  //이미지 처리
  const imsi = await PostImg.findOne({
    attributes: ["img"],
    where: { postId },
  });

  if(imsi){//이미지가 있으면
    const imgUrl = await getImageData.getImageData(postId);

    res.render("./postJoin/view", {
      post: post,
      date: date,
      dateValues: dateValues,
      num: num,
      nowId: req.id, //현재 유저의 아이디(참여하기 확인용)
      joinMembers: joinMembers,
      imgUrl: imgUrl,
    });
  } else {
      res.render("./postJoin/view", {
      post: post,
      date: date,
      dateValues: dateValues,
      num: num,
      nowId: req.id, //현재 유저의 아이디(참여하기 확인용)
      joinMembers: joinMembers,
      imgUrl: "",
    });
  }
});

//글 수정하러 가기
router.get("/goToUpdate", authJwt, async (req, res) => {
  const id = req.query.id;
  const post = await PostJoin.findOne({
    where: { id },
  });

  if (req.id == post.userId) {
    //날짜 처리
    let createdDate = post.createdAt.toISOString();
    const date = createdDate.substr(0, 10);
    createdDate = post.date.toISOString();
    const dateValue = createdDate.substr(0, 10);
    createdDate = post.period.toISOString();
    const period = createdDate.substr(0, 10);
    createdDate = post.confirm.toISOString();
    const confirm = createdDate.substr(0, 10);

    const dateValues = {
      date: dateValue,
      period: period,
      confirm: confirm,
    };

    //이미지 처리
    const postId = id;
    const imsi = await PostImg.findOne({
      attributes: ["img"],
      where: { postId },
    });

    if (imsi) {
      //이미지가 있으면
      const imgUrl = await getImageData.getImageData(postId);

      res.render("./postJoin/update", { post: post, date: date, dateValues: dateValues, imgUrl: imgUrl });
    } else {
      res.render("./postJoin/update", { post: post, date: date, dateValues: dateValues, imgUrl: " " });
    }
  } else {
    res.send(
      "<script>alert('작성자만 수정할 수 있습니다.');location.href='/post/postJoin/getPostList/1';</script>"
    );
  }
});

//글 수정
router.post("/update", authJwt, upload.single("image"), async (req, res) => {
  const id = req.query.id;
  const updatePost = {
    title: req.body.title,
    subtitle: req.body.subtitle,
    place: req.body.place,
    content: req.body.content,
    ps: req.body.ps,
    date: req.body.date,
    period: req.body.period,
    limit: req.body.limit,
    confirm: req.body.confirm,
  };

  await PostJoin.update(updatePost, { where: { id } });

  //이미지 처리
  const bucketName = "simsimbucket";
  const postId = id;
  const key = await PostImg.findOne({
    attributes: ["img"],
    where: { postId },
  });
  
  if (req.fileName) {
    if (key) {
      //기존 이미지 삭제
      imgDelete.imgDelete(bucketName, key.img, (err, data) => {
        if (err) {
          console.error(err);
        } else {
          console.log("success");
        }
      });

      const newImg = {
        img: req.fileName,
        postId: postId,
      };

      await PostImg.update(newImg, { where: { postId } });
    } else {
      const newImg = {
        img: req.fileName,
        postId: postId,
      };
      const comment = PostImg.build(newImg);
      await comment.save();
    }
  } else { //게시글에서 이미지를 지운 경우
    if(req.body.deleteCheck == "true") {
      //기존 이미지 삭제
      imgDelete.imgDelete(bucketName, key.img, (err, data) => {
        if (err) {
          console.error(err);
        } else {
          console.log("success");
        }
      });
      await PostImg.destroy({ where: { postId } });
    }
  }

  res.send(
    "<script>alert('수정되었습니다.');location.href='/post/postJoin/getPostList/1';</script>"
  );
});

//글 삭제
router.get("/delete", authJwt, async (req, res) => {
  if(req.id == req.query.userId){ // 로그인한사람과 글쓴사람이 같으면
    //S3이미지 삭제
    const bucketName = "simsimbucket";
    const postId = req.query.id;
    const key = await PostImg.findOne({
      attributes: ["img"],
      where: { postId },
    });
    
    if (key) {
      //기존 이미지 삭제
      imgDelete.imgDelete(bucketName, key.img, (err, data) => {
        if (err) {
          console.error(err);
        } else {
          console.log("success");
        }
      });
    }

    const id = req.query.id;
    await PostJoin.destroy({ where: { id }, cascade: true })
    res.send(
      "<script>alert('삭제되었습니다.');location.href='/post/postJoin/getPostList/1';</script>"
    );
  }
});


//참여하기
router.get("/join", authJwt, async (req, res) => {
  const userId = req.id;
  const postId = req.query.id
  const check = await JoinMember.findOne({
    where: { postId, userId },
  });

  if(check){
    res.send(
      `<script>alert('이미 신청한 사용자입니다.');location.href='/post/postJoin/view?id=${req.query.id}&num=${req.query.num}';</script>`
    );
  } else {
    const newJoin = {
      postId: req.query.id,
      userId: req.id,
      name: req.name,
    };
    const join = JoinMember.build(newJoin);
    await join.save();
    res.send(
      `<script>alert('참여 신청했습니다.');location.href='/post/postJoin/view?id=${newJoin.postId}&num=${req.query.num}';</script>`
    );
  }
});

//참여 취소
router.get("/cancel", authJwt, async (req, res) => {
  const userId = req.id;
  const check = await JoinMember.findOne({
    where: { userId },
  });

  if(!check){
    res.send(
      `<script>alert('신청 내역이 없습니다.');location.href='/post/postJoin/view?id=${req.query.id}&num=${req.query.num}';</script>`
    );
  } else {
    const userId = req.id;
    await JoinMember.destroy({ where: { userId } });
    res.send(
      `<script>alert('취소했습니다.');location.href='/post/postJoin/view?id=${req.query.id}&num=${req.query.num}';</script>`
    );
  }
});

module.exports = router;


