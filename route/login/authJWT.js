const jwt = require("./JWT");
const { verify, refreshVerify } = require("./JWT");

const db = require("../../models");
const { User } = db;
const { RefreshToken } = db;

const algorithm = process.env.JWT_ALG;
const expiresIn = process.env.JWT_EXP;

const authJWT = async (req, res, next) => {
  console.log("유효성 검사 진입");

  if (req.cookies) {
    let token = req.cookies.jwt_user; // header에서 access token을 가져옵니다.
    let result = verify(token); // token을 검증합니다.

    if (result.ok) {
      console.log("유효성 검증됨");
      // token이 검증되었으면 req에 값을 세팅하고, 다음 콜백함수로 갑니다.
      req.num = result.num;
      req.id = result.id;//userId
      // req.userId = result.id;
      req.name = result.name;
      next();
    } else {
      // 검증에 실패하거나 토큰이 만료되었다면 클라이언트에게 메세지를 담아서 응답합니다.
      console.log("유효성 검증되지 않음");

      if (result.message == "jwt expired") {
        //리프레시 토큰의 유효성 검사
        token = req.cookies.jwt_ref;
        const rToken = await RefreshToken.findOne({ where: { token } })
        const rResult = refreshVerify(rToken.token, rToken.userId);
        if (rResult.ok) {
          //access토큰 재발급
          const option = { algorithm, expiresIn };
          const userId = rResult.id;
          const [user] = await User.findAll({ where: { userId } });
          const payload = {
            num: user.id,
            id: user.userId,
            name: user.name,
          };

          token = jwt.createToken(payload);
          res.cookie("jwt_user", token, { httpOnly: true });
          console.log("토큰 재발급 되었습니당!");
          //재발급된 토큰을 다시 유효성 검사
          result = verify(token);
          req.num = result.num; //검사 통과했으면 세팅
          req.id = result.id;
          req.userId = result.userId;
          req.name = result.name;
          next();
        } else {
          //refresh토큰도 만료일 경우
          token = req.cookies.jwt_ref;
          res.clearCookie("jwt_user");
          res.clearCookie("jwt_ref");
          const deletedRefresh = await RefreshToken.destroy({where: { token },});
          console.log("토큰 만료로 인해 로그아웃 되었습니다");
          res.send(
            "<script>alert('토큰 만료로 인해 로그아웃 되었습니다.');location.href='/';</script>"
          );
        }
      } else {
        //이외의 에러
        res.send(
          `<script>alert(${result.message});location.href='/';</script>`
        );
      }
    }
  }
};

module.exports = authJWT;
