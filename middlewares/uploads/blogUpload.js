const crypto = require("crypto");
const path = require("path");

exports.uploadBlogImage = (req, res, next) => {
  try {
    if (req.files) {
      const file = req.files.blog_image;

      // Ensure file is an image
      if (!file.mimetype.startsWith("image")) {
        return res.status(400).json({ message: "Blog image must be an image" });
      }

      // Check file size (max 1MB)
      if (file.size > 1500000) {
        return res
          .status(400)
          .json({ message: "Blog image must be less than 1.5 MB" });
      }

      // Create custom filename
      let fileName = crypto.randomBytes(16).toString("hex");

      // Rename the file
      file.name = `${fileName}${path.parse(file.name).ext}`;

      // assign req.body. poster with file.name
      req.body.blog_image = file.name;

      // Upload  poster to /public/images
      file.mv(`./public/images/${file.name}`, async (err) => {
        if (err) {
          console.error(err);

          return res.status(500).json({
            message: "Internal Server Error when uploading",
            error: err,
          });
        }
      });
    }
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err,
    });
  }
};