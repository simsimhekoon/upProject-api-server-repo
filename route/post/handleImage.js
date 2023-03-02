const express = require("express");
const router = express.Router();

const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

router.use(express.json());

// const { uploadFile, handleUploadError } = require("./middleware.js");
const { upload } = require("./imgPostMw.js");

router.post("/imgUpload", upload.single("image"), (req, res) => {
  res.send("Image uploaded to S3");
});

//이미지 테스트
// router.post('/imgTest', uploadFile, handleUploadError, (req, res) => {
//     res.status(200).send('File uploaded successfully');
// });

module.exports = router;
