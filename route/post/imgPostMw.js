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

// let storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // 서버에 저장될 위치
//     cb(null, "./route/testRoute/testImage");
//   },
//   filename: (req, file, cb) => {
//     // 서버에 저장될 때 파일 이름
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// let uploadFile = multer({
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 },
//   fileFilter: fileFilter,
// }).single("image"); // 프론트에서 넘겨울 params key 값, 오른쪽 같이 넘겨줘야함-> {image: binary}

// function handleUploadError(err, req, res, next) {
//   if (err instanceof multer.MulterError) {
//     if (err.code === "LIMIT_FILE_SIZE") {
//       return res.status(400).send("File too large");
//     }
//   } else {
//     console.error(err);
//     return res.status(500).send("Internal server error");
//   }
// }


aws.config.update({
  accessKeyId: "AKIAWRUUXKZIKL25OV7R",
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
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter,
});

// module.exports = { uploadFile, handleUploadError };
module.exports = { upload };
