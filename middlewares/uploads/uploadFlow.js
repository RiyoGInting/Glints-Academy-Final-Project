const crypto = require("crypto");
const path = require("path");

exports.uploadKtp = (req, res, next) => {
  try {
    if (req.files) {
      const file = req.files.ktp_image;

      // Make sure poster
      if (!file.mimetype.startsWith("image")) {
        return res.status(400).json({ message: "ktp must be an image" });
      }

      // Check file size (max 1MB)
      if (file.size > 1000000) {
        return res
          .status(400)
          .json({ message: "ktp image must be less than 1MB" });
      }

      // Create custom filename
      let fileName = crypto.randomBytes(16).toString("hex");

      // Rename the file
      file.name = `${fileName}${path.parse(file.name).ext}`;

      // assign req.body. poster with file.name
      req.body.ktp_image = file.name;

      // Upload  poster to /public/images
      file.mv(`./public/images/${file.name}`, async (err) => {
        if (err) {
          console.error(err);

          return res.status(500).json({
            message: "Internal Server Error at upload",
            error: err,
          });
        }
      });
    }
    next();
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Internal Server Error",
      error: e,
    });
  }
};

exports.uploadLogo = (req, res, next) => {
  try {
    if (req.files) {
      const file = req.files.partner_logo;

      // Make sure poster
      if (!file.mimetype.startsWith("image")) {
        return res.status(400).json({ message: "logo must be an image" });
      }

      // Check file size (max 1MB)
      if (file.size > 1000000) {
        return res.status(400).json({ message: "logo must be less than 1MB" });
      }

      // Create custom filename
      let fileName = crypto.randomBytes(16).toString("hex");

      // Rename the file
      file.name = `${fileName}${path.parse(file.name).ext}`;

      // assign req.body. poster with file.name
      req.body.ktp_image = file.name;

      // Upload  poster to /public/images
      file.mv(`./public/images/${file.name}`, async (err) => {
        if (err) {
          console.error(err);

          return res.status(500).json({
            message: "Internal Server Error at upload",
            error: err,
          });
        }
      });
    }
    next();
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Internal Server Error",
      error: e,
    });
  }
};

/*

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

exports.uploadImage = async (req, res, next) => {
  try {
    // Initialita
    let errors = [];

    // If image was uploaded
    if (req.files) {
      const file = req.files.image;

      // Make sure image is photo
      if (!file.mimetype.startsWith("image")) {
        errors.push("File must be an image");
      }

      // If errors length > 0, it will make errors message
      if (errors.length > 0) {
        // Because bad request
        return res.status(400).json({
          message: errors.join(", "),
        });
      }

      // Check file size (max 1MB)
      if (file.size > 1000000) {
        errors.push("Image must be less than 1MB");
      }

      // If errors length > 0, it will make errors message
      if (errors.length > 0) {
        // Because bad request
        return res.status(400).json({
          message: errors.join(", "),
        });
      }

      // Create custom filename
      let fileName = crypto.randomBytes(16).toString("hex");

      // Rename the file
      file.name = `${fileName}${path.parse(file.name).ext}`;

      // Upload image to /public/images
      req.body.image = await run(
        req.body.directory,
        file.name,
        file.data,
        file.mimetype
      );
    }

    next();
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};


  */
