"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  transaction.init(
    {
      id_user: DataTypes.INTEGER,
      id_partner: DataTypes.INTEGER,
      token: DataTypes.STRING,
      expired_payment: DataTypes.DATE,
      redirect_url: DataTypes.STRING,
      appointment_date: DataTypes.DATE,
      appointment_hours: DataTypes.TIME,
      appointment_address: DataTypes.STRING,
      total_item: DataTypes.INTEGER,
      total_fee: DataTypes.DECIMAL,
      order_status: DataTypes.ENUM(
        "waiting",
        "accepted",
        "cancelled",
        "on process",
        "done"
      ),
      payment_status: DataTypes.ENUM("pending", "failed", "success"),
      payment_type: DataTypes.STRING,
      payment_proof: DataTypes.STRING,
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,

      modelName: "transaction",
    }
  );
  return transaction;
};
