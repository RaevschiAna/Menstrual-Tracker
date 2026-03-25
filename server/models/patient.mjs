export default (sequelize, DataTypes) => {
  return sequelize.define('patient', {
     email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isEmail: true
      }
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    dateOfBirth: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    height: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    weight:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    notes:{
        type: DataTypes.TEXT,
    },
    token:{
      type:DataTypes.TEXT
    }
  });
};
