export default (sequelize, DataTypes) => {
  return sequelize.define('cycle', {
    periodStart: {
      type: DataTypes.DATE,
      allowNull: false
    },
    periodEnd: {
      type: DataTypes.DATE,
      allowNull: false
    },
    predicted: {
      type: DataTypes.BOOLEAN
    }
  }, 
  {
    timestamps: true   
  });
};
