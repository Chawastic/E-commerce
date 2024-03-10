const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Role = sequelize.define('Role', {
    name: DataTypes.STRING,
  });

  Role.associate = (models) => {
    Role.hasMany(models.User, { foreignKey: 'role_id' }); //already started building with role_id instead of keeping unity using roleID (just keep as)
  };

  return Role;
};
