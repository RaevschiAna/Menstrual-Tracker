export default (sequelize, DataTypes) => {
  return sequelize.define('clinicalNote', {
    notes: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, 
  {
    timestamps: true   
  });
};
