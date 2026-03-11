export default (sequelize, DataTypes) => {
  return sequelize.define('notification', {
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    read: {
      type: DataTypes.BOOLEAN
    }
  }, 
  {
    timestamps: true   
  });
};
