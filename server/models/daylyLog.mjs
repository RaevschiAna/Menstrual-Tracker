export default (sequelize, DataTypes) => {
  return sequelize.define('dailyLog', {
    logDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    cycleDay: {
      type: DataTypes.STRING,
      allowNull: false
    },
    flowLevel: {
      type: DataTypes.STRING
    },
    mood: {
        type: DataTypes.STRING
    },
    painLevel:{
        type: DataTypes.INTEGER
    },
    symptoms:{
        type: DataTypes.TEXT
    },
    notes:{
        type: DataTypes.TEXT
    }
  }, 
  {
    timestamps: true   
  });
};
