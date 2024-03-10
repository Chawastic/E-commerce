const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Brand = sequelize.define('Brand', {
    name: DataTypes.STRING,
  });

  Brand.associate = (models) => {
    Brand.hasMany(models.Product, { foreignKey: 'brandId' });
  };

  return Brand;
};
