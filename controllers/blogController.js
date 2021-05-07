const { blog, user } = require("../models"); // Import all models

class BlogController {
  // Get All blog data
  async getAll(req, res) {
    try {
      let data = await blog.findAll({
        // pagination (still need to edit)
        limit: parseInt(req.query.limit),
        offset: (parseInt(req.query.page) - 1) * parseInt(req.query.limit),
      });

      if (data.length === 0) {
        return res.status(404).json({
          message: "No articles not found",
        });
      }
      // if successful
      return res.status(200).json({
        message: "Success",
        data,
      });
    } catch (e) {
      // If error
      return res.status(500).json({
        message: "Internal Server Error",
        error: e,
      });
    }
  }

  // Get One blog
  async getOne(req, res) {
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

      if (data.length === 0) {
        return res.status(404).json({
          message: "Data not found",
        });
      }
      return res.status(200).json({
        message: "Success",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error",
        error,
      });
    }
  } // end of Get One


  // Create Data
  async create(req, res) {
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
      return res.status(500).json({
        message: "Internal Server Error",
        error: e,
      });
    }
  } // end of create

  // Update data
  async update(req, res) {
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
        return res.status(404).json({
          message: "Article not found",
        });
      }
      return res.status(201).json({
        message: "Successfully updated",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error",
        error,
      });
    }
  } // End of Update

  // Delete blog Data
  async delete(req, res) {
    try {
      // Delete data
      let data = await blog.destroy({ where: { id: req.params.id } });

      if (!data) {
        return res.status(404).json({
          message: "Articles not found",
        });
      }

      // If successful
      return res.status(200).json({
        message: "Article successfully deleted",
      });
    } catch (e) {
      // If error
      return res.status(500).json({
        message: "Internal Server Error",
        error: e,
      });
    }
  } // end of Delete
}

module.exports = new BlogController();