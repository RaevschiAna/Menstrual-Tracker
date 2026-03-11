export default (sequelize, DataTypes) => {
  return sequelize.define('clinicalNote', {
    notes: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, 
  {
    timestamps: true   
  });
};
