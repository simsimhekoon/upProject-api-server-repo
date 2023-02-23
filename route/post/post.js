const express = require("express");
const router = express.Router();

const authJwt = require("../login/authJWT");

const cookieParser = require("cookie-parser");

const db = require("../../models");
const { Post } = db;
const { Comment } = db;

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cookieParser());

//게시판 글 목록
router.get("/getPostList/:page", authJwt, async (req, res) => {
  const currentPage = parseInt(req.params.page);
  const postList = await Post.findAll(
    {
      attributes: [
        "id",
        "userId",
        "name",
        "title",
        "content",
        "viewCount",
        "createdAt",
      ],
      order: [["id", "DESC"]],
      offset: currentPage * 5 - 5,
      limit: 5,
    },
  );
  const allPage = await Post.findAll();

  if(postList.length == 0){ //게시글이 하나도 없는경우
    res.render("post", { postList: "", date: "" });
  } else {
    res.render("post", { postList: postList, allPage: allPage.length, currentPage:currentPage });
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
    "<script>alert('작성되었습니다.');location.href='/post/post/getPostList/1';</script>"
  );
});

//글 보기
router.get("/view/:commentPage", authJwt, async (req, res) => {
  const id = req.query.id;
  const num = req.query.num;
  
  //조회수
  await Post.increment({viewCount: 1}, {where:{ id }});

  //본문처리
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

  //댓글처리
  const postId = id;
  const currentPage = req.params.commentPage;
  const comment = await Comment.findAll({ attributes: ["name", "content"], where: { postId }, order: [["id", "DESC"]], offset: currentPage * 10 - 10, limit: 10 });

  const allPage = await Comment.findAll({ where: { postId } });
  res.render("view", { post: post, date: date, num: num, comment: comment, allPage: allPage.length, currentPage: currentPage });
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
      "<script>alert('작성자만 수정할 수 있습니다.');location.href='/post/post/getPostList/1';</script>"
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
    "<script>alert('수정되었습니다.');location.href='/post/post/getPostList/1';</script>"
  );
});

//글 삭제
router.get("/delete", authJwt, async (req, res) => {
  if(req.id == req.query.userId){ // 로그인한사람과 글쓴사람이 같으면
    const id = req.query.id;
    await Post.destroy({ where: { id } });
    res.send(
      "<script>alert('삭제되었습니다.');location.href='/post/post/getPostList/1';</script>"
    );
  }
});

module.exports = router;


