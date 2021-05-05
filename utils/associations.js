const {
  blog,
  category,
  partner,
  review,
  transaction,
  user,
} = require("../models");

// user and transaction relationship
user.hasMany(transaction, { foreignKey: "id_user" });
transaction.belongsTo(user, { foreignKey: "id_user" });

// transaction and partner relationship
partner.hasMany(transaction, { foreignKey: "id_partner" });
transaction.belongsTo(partner, { foreignKey: "id_partner" });

// blog and user relationship
user.hasMany(blog, { foreignKey: "id_user" });
blog.belongsTo(user, { foreignKey: "id_user" });

//  partner and category relationship
category.hasMany(partner, { foreignKey: "id_category" });
partner.belongsTo(category, { foreignKey: "id_category" });


// review and transaction relationship
review.hasOne(transaction, { foreignKey: "id_transaction" });
transaction.belongsTo(review, { foreignKey: "id_transaction" });
