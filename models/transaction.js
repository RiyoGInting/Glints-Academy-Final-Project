'use strict';
const {
  Model
} = require('sequelize');
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
  };
  transaction.init({
    order_date: DataTypes.DATE,
    appointment_date: DataTypes.DATE,
    total_fee: DataTypes.DECIMAL,
    order_status: DataTypes.STRING,
    payment_status: DataTypes.STRING,
    payment_type: DataTypes.STRING,
    payment_proof: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'transaction',
  });
  return transaction;
};