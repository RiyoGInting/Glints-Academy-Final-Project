const { partner, service, category, Sequelize } = require("../models");

class ServiceController {
  // Get all Service
  async getAll(req, res, next) {
    try {
      //pagination
      let data = await service.findAll({
        limit: parseInt(req.query.limit),
        offset: (parseInt(req.query.page) - 1) * parseInt(req.query.limit),
      });

      if (data.length === 0) {
        return next({ message: "Data not found", statusCode: 404 });
      }
      return res.status(200).json({
        message: "Success",
        data,
      });
    } catch (e) {
      return next(e);
    }
  }

  // Get one Service
  async getOne(req, res, next) {
    try {
      let data = await service.findOne({
        where: {
          id: req.params.id,
        },
        include: [
          {
            model: category,
            attributes: ["category_name"],
          },
          { model: partner, attributes: ["brand", "business_address"] },
        ],
      });

      if (data.length === 0) {
        return next({ message: "Data not found", statusCode: 404 });
      }
      return res.status(200).json({
        message: "Success",
        data,
      });
    } catch (e) {
      return next(e);
    }
  }

  // Get all Service by a Partner
  async getAllByPartner(req, res, next) {
    try {
      let data = await service.findAll({
        where: {
          id_partner: req.params.id,
        },
        limit: parseInt(req.query.limit),
        offset: (parseInt(req.query.page) - 1) * parseInt(req.query.limit),
      });

      if (data.length === 0) {
        return next({ message: "Data not found", statusCode: 404 });
      }
      return res.status(200).json({
        message: "Success",
        data,
      });
    } catch (e) {
      return next(e);
    }
  }

  // Get all Service by a Category
  async getAllByCategory(req, res, next) {
    try {
      let data = await service.findAll({
        where: {
          id_category: req.params.id,
        },
        limit: parseInt(req.query.limit),
        offset: (parseInt(req.query.page) - 1) * parseInt(req.query.limit),
      });

      if (data.length === 0) {
        return next({ message: "Data not found", statusCode: 404 });
      }
      return res.status(200).json({
        message: "Success",
        data,
      });
    } catch (e) {
      return next(e);
    }
  }

  //  Get all Service by a Name/Keyword(search)
  async searchByName(req, res, next) {
    try {
      let data = await service.findAll({
        where: {
          service_name: { [Sequelize.Op.like]: `%${req.query.name}%` },
        },
        limit: parseInt(req.query.limit),
        offset: (parseInt(req.query.page) - 1) * parseInt(req.query.limit),
      });

      if (data.length === 0) {
        return next({ message: "Data not found", statusCode: 404 });
      }
      return res.status(200).json({
        message: "Success",
        data,
      });
    } catch (e) {
      return next(e);
    }
  }

  // Create Service
  async create(req, res, next) {
    try {
      let newData = await service.create(req.body);

      let data = await service.findOne({
        where: {
          id: newData.id,
        },
        include: [
          {
            model: category,
            attributes: ["category_name"],
          },
          { model: partner, attributes: ["brand", "business_address"] },
        ],
      });

      return res.status(200).json({
        message: "Success",
        data,
      });
    } catch (e) {
      return next(e);
    }
  }

  // Update Service
  async update(req, res, next) {
    try {
      let newData = await service.update(req.body, {
        where: {
          id: req.params.id,
        },
      });

      let data = await service.findOne({
        where: {
          id: req.params.id,
        },
        include: [
          {
            model: category,
            attributes: ["category_name"],
          },
          { model: partner, attributes: ["brand", "business_address"] },
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
  }

  // Delete Service
  async delete(req, res) {
    try {
      let data = await service.destroy({
        where: { id: req.params.id },
      });

      if (!data) {
        return next({ message: "Data not found", statusCode: 404 });
      }
      return res.status(200).json({
        message: "Success",
      });
    } catch (e) {
      return next(e);
    }
  }
}
module.exports = new ServiceController();
