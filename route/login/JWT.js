require("dotenv").config();
const jwt = require("jsonwebtoken");


const secretKey = process.env.SECRET_KEY;
const algorithm = process.env.JWT_ALG;
const expiresIn = process.env.JWT_EXP;
const expiresInR = process.env.JWT_EXP_R;

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
function createRefresh() {
  return jwt.sign({}, secretKey, {expiresIn: expiresInR});
}

//refresh토큰 유혀성
function refreshVerify(token, userId) {
  let decoded = null;
  try {
    decoded = decodeToken(token);
    return {
      ok: true,
      id: userId,
    };
  } catch (err) {
    return {
      ok: false,
      message: err.message,
    };
  }
}


module.exports = { createToken, decodeToken, verify, createRefresh, refreshVerify};