const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Membership = sequelize.define('Membership', {
    name: DataTypes.STRING,
    discount_rate: DataTypes.DECIMAL(10, 2),
    min_purchases: DataTypes.INTEGER,
  });

  Membership.associate = (models) => {
    Membership.hasMany(models.User, { foreignKey: 'membership_id' });//already started building with membership_id instead of keeping unity using membershipId (just keep as)
  };

  return Membership;
};
