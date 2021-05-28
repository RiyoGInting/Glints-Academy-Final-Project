const {uploadS3} = require("../../helpers/uploadToS3")

exports.uploadKTP = async (req, res, next) => {
  try {
    // If image was uploaded
    if (req.files.ktp_image) {
      const file = req.files.ktp_image;

      // Upload image to /public/images
      req.body.ktp_image = await uploadS3(req.body.directory, file);
    }

    next();
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

exports.uploadLogo = async (req, res, next) => {
  try {
    // Initialita
    if (req.files.partner_logo) {
      const file = req.files.partner_logo;

      // Upload image to /public/images
      req.body.partner_logo = await uploadS3(req.body.directory, file);
    }

    next();
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

exports.uploadBlogImage = async (req, res, next) => {
  try {
    if (req.files.blog_image) {
      const file = req.files.blog_image;

      // Upload image to /public/images
      req.body.blog_image = await uploadS3(req.body.directory, file);
    }

    next();
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

exports.uploadPhoto = async (req, res, next) => {
  try {
    // If image was uploaded
    if (req.files) {
      const file = req.files.photo_profile;

      req.body.photo_profile = await uploadS3(req.body.directory, file);
    }

    next();
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

exports.uploadIcon = async (req, res, next) => {
  try {
    if (req.files) {
      const file = req.files.category_icon;

      req.body.category_icon = await uploadS3(req.body.directory, file);
    }

    next();
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};
