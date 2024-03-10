const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    address: DataTypes.STRING,
    telephonenumber: DataTypes.STRING,
    purchases: DataTypes.INTEGER // will be used to compare amount to memberships
  });

  User.associate = (models) => {
    User.hasMany(models.Order);
    User.belongsTo(models.Membership, { foreignKey: 'membership_id' });//already started building with membership_id instead of keeping unity using membershipId (just keep as)
    User.belongsTo(models.Role, { foreignKey: 'role_id' }); //already started building with role_id instead of keeping unity using roleID (just keep as)
  };

  return User;
};
