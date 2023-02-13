require("dotenv").config();
const jwt = require("jsonwebtoken");


const secretKey = process.env.SECRET_KEY;
const algorithm = process.env.JWT_ALG;
const expiresIn = process.env.JWT_EXP;

const option = {algorithm, expiresIn};

function createToken(payload) {
  return jwt.sign(payload, secretKey, option);
}

function decodeToken(token) {
  return jwt.verify(token, secretKey);
}

//유효성 검사
function verify(token) {
  let decoded = null;
  try {
    decoded = decodeToken(token);
    return {
      ok: true,
      num: decoded.num,
      id: decoded.id,
      name: decoded.name,
    };
  } catch (err) {
    return {
      ok: false,
      message: err.message,
    };
  }
}

//refresh토큰 발급
function refresh() {
  return jwt.sign({}, secretKey, option);
}

//refresh토큰 유혀성
function refreshVerify() {

}


module.exports = { createToken, decodeToken, verify, refresh, refreshVerify};