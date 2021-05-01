const { partner, service, category } = require("../models");

class ServiceController {
  // Get all Service
  async getAll(req, res) {
    try {
      let data = await service.findAll();

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
  }

  // Get one Service
  async getOne(req, res) {
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
  }

  // Get all Service by a Partner
  async getAllByPartner(req, res) {
    try {
      let data = await service.findAll({
        where: {
          id_partner: req.params.id,
        },
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
  }

  // Get all Service by a Category
  async getAllByCategory(req, res) {
    try {
      let data = await service.findAll({
        where: {
          id_category: req.params.id,
        },
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
  }

  // Get all Service by a Name/Keyword(search)
  //   async searchByName(req, res) {
  //     try {
  //       let data = await service.findAll({
  //         where: {
  //           service_name: { [Op.like]: req.query.name },
  //         },
  //       });

  //       if (data.length === 0) {
  //         return res.status(404).json({
  //           message: "Data not found",
  //         });
  //       }
  //       return res.status(200).json({
  //         message: "Success",
  //         data,
  //       });
  //     } catch (error) {
  //         console.log(error)
  //       return res.status(500).json({
  //         message: "Internal Server Error",
  //         error,
  //       });
  //     }
  //   }

  // Create Service
  async create(req, res) {
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
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error",
        error,
      });
    }
  }

  // Update Service
  async update(req, res) {
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
  }

  // Delete Service
  async delete(req, res) {
    try {
      let data = await service.destroy({
        where: { id: req.params.id },
      });

      if (!data) {
        return res.status(404).json({
          message: "Data not found",
        });
      }
      return res.status(200).json({
        message: "Success",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error",
        error,
      });
    }
  }
}
module.exports = new ServiceController();
