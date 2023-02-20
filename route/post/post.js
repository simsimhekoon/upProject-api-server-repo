const express = require("express");
const router = express.Router();

const authJwt = require("../login/authJWT");

const cookieParser = require("cookie-parser");

const db = require("../../models");
const { Post } = db;

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cookieParser());

//게시판 글 목록
router.get("/getPostList", authJwt, async (req, res) => {
  const postList = await Post.findAll({
    attributes: ["id", "userId", "name", "title", "content", "viewCount", "createdAt"],
  });
  if(postList.length == 0){ //게시글이 하나도 없는경우
    res.render("post", { postList: "", date: "" });
  } else {
    const createdDate = postList[0].createdAt.toISOString();
    const date = createdDate.substr(0, 10);
    res.render("post", { postList: postList, date: date });
  }
});

//글 쓰러가기
router.get("/goToWrite", authJwt, async (req, res) => {
  const name = req.name;
  res.render("write", {name: name});
});

//글쓰기
router.post("/write", authJwt, async (req, res) => {
  const newPost = {
    "userId": req.id,
    "name": req.name,
    "title": req.body.title,
    "content": req.body.content,
    "viewCount": 0
  };
  const post = Post.build(newPost);
  await post.save();
  res.send(
    "<script>alert('작성되었습니다.');location.href='/post/post/getPostList';</script>"
  );
});

//글 보기
router.get("/view", authJwt, async (req, res) => {
  const id = req.query.id;
  const num = req.query.num;

  await Post.increment({viewCount: 1}, {where:{ id }});

  const post = await Post.findOne({
    attributes: [
      "id",
      "userId",
      "name",
      "title",
      "content",
      "viewCount",
      "createdAt",
    ],
    where: { id },
  });
  const createdDate = post.createdAt.toISOString();
  const date = createdDate.substr(0, 10);

  res.render("view", { post: post, date: date, num: num });
});

//글 수정하러 가기
router.get("/goToUpdate", authJwt, async (req, res) => {
  const id = req.query.id;
  const post = await Post.findOne({
    attributes: [
      "id",
      "userId",
      "name",
      "title",
      "content",
      "viewCount",
      "createdAt",
    ],
    where: { id },
  });
  if(req.id == post.userId){
    res.render("update", { post: post });
  } else {
    res.send(
      "<script>alert('작성자만 수정할 수 있습니다.');location.href='/post/post/getPostList';</script>"
    );
  }
});

//글 수정
router.post("/update", authJwt, async (req, res) => {
  const id = req.query.id;
  const updatePost = {
    "title": req.body.title,
    "content": req.body.content,
  };

  await Post.update(updatePost, { where: { id } });

  res.send(
    "<script>alert('수정되었습니다.');location.href='/post/post/getPostList';</script>"
  );
});

//글 삭제
router.get("/delete", authJwt, async (req, res) => {
  if(req.id == req.query.userId){ // 로그인한사람과 글쓴사람이 같으면
    const id = req.query.id;
    await Post.destroy({ where: { id } });
    res.send(
      "<script>alert('삭제되었습니다.');location.href='/post/post/getPostList';</script>"
    );
  }
});

module.exports = router;


