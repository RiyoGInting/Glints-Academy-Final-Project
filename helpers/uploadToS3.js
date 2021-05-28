const path = require("path"); // to detect path of directory
const crypto = require("crypto"); // to encrypt something
// Import required AWS SDK clients and commands for Node.js
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

// Set the AWS region
const REGION = "ap-southeast-1"; //e.g. "us-east-1"

// Set the parameters.
const uploadParams = (directory, filename, body, mimetype) => {
  return {
    ACL: "public-read",
    Bucket: process.env.S3_BUCKET,
    Key: `${directory}/${filename}`,
    Body: body,
    ContentType: mimetype,
  };
};

// Create Amazon S3 service client object.
const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});

const run = async (directory, filename, body, mimetype) => {
  try {
    const data = await s3.send(
      new PutObjectCommand(uploadParams(directory, filename, body, mimetype))
    );

    return directory + "/" + filename;
  } catch (err) {
    console.log("Error", err);
  }
};

exports.uploadS3 = async (directory, file) => {
  try {
    // Create custom filename
    let fileName = crypto.randomBytes(16).toString("hex");

    // Rename the file
    file.name = `${fileName}${path.parse(file.name).ext}`;

    // Upload image to /public/images
    let image = await run(directory, file.name, file.data, file.mimetype);

    return image;
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};
