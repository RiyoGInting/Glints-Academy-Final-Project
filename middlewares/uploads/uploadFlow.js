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
          return res
            .status(400)
            .json({ message: "logo must be less than 1MB" });
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