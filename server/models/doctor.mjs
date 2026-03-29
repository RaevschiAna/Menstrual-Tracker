export default (sequelize, DataTypes) => {
  return sequelize.define('doctor', {
     email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: false
    },
    licenceNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: {
      type: DataTypes.TEXT
    }
  });
};
