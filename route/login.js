const express = require('express');
const router = express.Router();
const session = require('express-session');
const memoryStore = require('memorystore')(session);

const db = require("../models");
const { User } = db;

router.use(express.json());
router.use(express.urlencoded({extended: true}));

const maxAge = 1000 * 60 * 5;

const sessionObj = {
    secret: 'simsim',
    resave: false,
    saveUninitialized: true,
    store: new memoryStore({checkPeriod: maxAge}),
    cookie:{
        maxAge,
    },
};

router.use(session(sessionObj));

//유저 리스트 보기
router.get('/members', async (req, res) => {
  const { id } = req.query;
  if (id) {
    const teamMembers = await User.findAll({ where: { id } }); 
    res.send(teamMembers);
  } else {
    const members = await User.findAll(); 
    res.send(members);
  }
});

//로그인 페이지, 차후 경로 수정해서 아래 로그인 시도의 주석처리부분과 함께 사용
// router.get('/user/login', (req, res) => {
//     const msg = req.query.msg;
//     res.render('./user/login', { msg });
// });

//로그인 시도
router.post('/signIn', async (req, res) => {
    const { userId, pw } = req.body;
    const [user] = await User.findAll({ where: { userId, pw } });
    if(user){
        console.log("로그인 되었습니다");
        req.session.user = user;
        // console.log(req.session);
        // console.log(req.session.user.userId);
        // console.log(req.session.user.pw);
        res.redirect("http://localhost:8000/loginSuccess");
    }else{
        // res.redirect('/user/login?msg=등록되지 않은 사용자 입니다');
        console.log("등록된 사용자가 아니거나 비밀번호가 틀렸습니다");
    }
});

//로그아웃
router.get('/logOut', async (req, res) => {
    req.session.destroy(() => {
        req.session;
    });
    console.log('로그아웃 되었습니다');
    // console.log(req.session);
    res.send("logoutSuccess");
})

//쓰기
router.post('/signUp', async (req, res) => {
    const newUser = req.body;
    const user = User.build(newUser);
    await user.save();
    res.redirect("http://localhost:8000");
});

module.exports = router;