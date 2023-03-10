const AWS = require("aws-sdk");
const fs = require("fs");

const db = require("../../models");
const { PostImg } = db;

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  signatureVersion: "v4",
});

const getImageUrl = (bucketName, key) => {
  const url = s3.getSignedUrl("getObject", {
    Bucket: bucketName,
    Key: key,
    Expires: 60 * 5, // URL의 만료 시간을 5분으로 지정
  });
  return url;
};

const getImage = (bucketName, key, callback) => {
  const params = {
    Bucket: bucketName,
    Key: key
  };
  
  s3.getObject(params, (err, data) => {
    if (err) {
      console.log(err);
      callback(err);
    } else {
      const imageUrl = getImageUrl(bucketName, key);
      callback(null, data.Body, imageUrl);
    }
  });
};

const getImageAsync = (bucketName, key) => {
  return new Promise((resolve, reject) => {
    getImage(bucketName, key, (err, data, url) => {
      if (err) {
        reject(err);
      } else {
        resolve({ data, url });
      }
    });
  });
};

const getImageData = async (postId) => {
  const bucketName = "simsimbucket";
  const imsi = await PostImg.findOne({
    attributes: ["img"],
    where: { postId },
  });

  let imgUrl = "";

  if (imsi) {
    const key = imsi.img; // 다운로드할 이미지 파일의 이름

    imgUrl = await getImageAsync(bucketName, key);
    return imgUrl.url;
  }
};

module.exports = {
  getImageData
};
