const { verify } = require("./JWT");

const authJWT = (req, res, next) => {
  console.log("유효성 검사 진입");

  if (req.cookies) {
    const token = req.cookies.jwt_user; // header에서 access token을 가져옵니다.
    const result = verify(token); // token을 검증합니다.

    if (result.ok) {
      console.log("유효성 검증됨");
      // token이 검증되었으면 req에 값을 세팅하고, 다음 콜백함수로 갑니다.
      req.num = result.num;
      req.id = result.id;
      req.userId = result.userId;
      req.name = result.name;
      next();
    } else {
      // 검증에 실패하거나 토큰이 만료되었다면 클라이언트에게 메세지를 담아서 응답합니다.
      console.log("유효성 검증되지 않음");

      if (result.message == "jwt expired"){
        //유효성 검사의 실패사유가 jwt만료일 경우 로그아웃
        res.clearCookie("jwt_user");
        console.log("토큰 만료로 인해 로그아웃 되었습니다");
        res.send("<script>alert('토큰 만료로 인해 로그아웃 되었습니다.');location.href='/';</script>");
      } else {
        res.send(`<script>alert(${result.message});location.href='/';</script>`);
      }
    }
  }
};

module.exports = authJWT;