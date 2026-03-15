export default (sequelize, DataTypes) => {
  return sequelize.define('patient', {
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
    dateOfBirth: {
      type: DataTypes.STRING,
      allowNull: false
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
