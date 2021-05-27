const { blog, user } = require("../models"); // Import all models

class BlogController {
  // Get All blog data
  async getAll(req, res, next) {
    try {
      let data = await blog.findAll({
        // pagination (still need to edit)
        limit: parseInt(req.query.limit),
        offset: (parseInt(req.query.page) - 1) * parseInt(req.query.limit),
      });

      if (data.length === 0) {
        return next({ message: "No articles not found", statusCode: 404 });
      }
      // if successful
      return res.status(200).json({
        message: "Success",
        data,
      });
    } catch (e) {
      // If error
      return next(e);
    }
  }

  // Get One blog
  async getOne(req, res, next) {
    try {
      let data = await blog.findOne({
        where: {
          id: req.params.id,
        },
        include: [
          {
            model: user,
            attributes: ["name"],
          },
        ],
      });

      if (!data) {
        return next({ message: "Data not found", statusCode: 404 });
      }
      return res.status(200).json({
        message: "Success",
        data,
      });
    } catch (e) {
      return next(e);
    }
  } // end of Get One

  // Create Data
  async create(req, res, next) {
    try {
      // Create data
      let newBlog = await blog.create(req.body);

      // Find the new transaksi
      let data = await blog.findOne({
        where: { id: newBlog.id },
        include: [
          {
            model: user,
            attributes: ["name"],
          },
        ],
      });

      // If success
      return res.status(201).json({
        message: "Article successfully posted",
        data,
      });
    } catch (e) {
      // If error
      return next(e);
    }
  } // end of create

  // Update data
  async update(req, res, next) {
    try {
      let updatedBlog = await blog.update(req.body, {
        where: {
          id: req.params.id,
        },
      });

      let data = await blog.findOne({
        where: {
          id: req.params.id,
        },
        include: [
          {
            model: user,
            attributes: ["name"],
          },
        ],
      });

      // if article not found
      if (!data) {
        return next({ message: "Article not found", statusCode: 404 });
      }
      return res.status(201).json({
        message: "Successfully updated",
        data,
      });
    } catch (e) {
      return next(e);
    }
  } // End of Update

  // Delete blog Data
  async delete(req, res, next) {
    try {
      // Delete data
      let data = await blog.destroy({ where: { id: req.params.id } });

      if (!data) {
        return next({ message: "Articles not found", statusCode: 404 });
      }

      // If successful
      return res.status(200).json({
        message: "Article successfully deleted",
      });
    } catch (e) {
      return next(e);
    }
  } // end of Delete
}

module.exports = new BlogController();
