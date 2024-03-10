const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
    status: DataTypes.STRING,
  });

  Order.associate = (models) => {
    Order.belongsTo(models.User);
    Order.hasMany(models.OrderItem, { as: 'orderItems', foreignKey: 'OrderId' });
    Order.belongsToMany(models.Product, { through: models.OrderItem });
  };

  return Order;
};
