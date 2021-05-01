const {
  blog,
  category,
  partner,
  review,
  service,
  transaction,
  user,
} = require("../models");

// user and transaction relationship
user.hasMany(transaction, { foreignKey: "id_user" });
transaction.belongsTo(user, { foreignKey: "id_user" });

// transaction and service relationship
service.hasMany(transaction, { foreignKey: "id_service" });
transaction.belongsTo(service, { foreignKey: "id_service" });

// blog and user relationship
user.hasMany(blog, { foreignKey: "id_user" });
blog.belongsTo(user, { foreignKey: "id_user" });

//  service and category relationship
category.hasMany(service, { foreignKey: "id_category" });
service.belongsTo(category, { foreignKey: "id_category" });

// service and partner relationship
partner.hasMany(service, { foreignKey: "id_partner" });
service.belongsTo(patner, { foreignKey: "id_partner" });

// review and transaction relationship
review.hasOne(transaction, { foreignKey: "id_transaction" });
transaction.belongsTo(review, { foreignKey: "id_transaction" });
