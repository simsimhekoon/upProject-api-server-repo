const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

const fileFilter = (req, file, cb) => {
  // 확장자 필터링
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/gif"
  ) {
    cb(null, true); // 해당 mimetype만 받겠다는 의미
  } else {
    // 다른 mimetype은 저장되지 않음
    cb(null, false);
  }
};

aws.config.update({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  region: "ap-northeast-2",
});

const s3 = new aws.S3();

//s3에 파일 업로드
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "simsimbucket",
    acl: "public-read",
    key: function (req, file, cb) {
      const fileName = Date.now() + "-" + file.originalname;
      req.fileName = fileName;
      cb(null, fileName);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter,
});

module.exports = { upload };
