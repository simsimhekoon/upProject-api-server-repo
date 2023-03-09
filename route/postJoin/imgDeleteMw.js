const aws = require("aws-sdk");

aws.config.update({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  region: "ap-northeast-2",
});

let s3 = new aws.S3();

const imgDelete = (bucketName, key) => {
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  s3.deleteObject(params, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log('success');
    }
  });
};

module.exports = { imgDelete };
