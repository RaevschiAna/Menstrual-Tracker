export default (sequelize, DataTypes) => {
  return sequelize.define('cycle', {
    // Medical History Fields
    ageAtFirstPeriod: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cycleLength: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Average cycle length in days'
    },
    periodDuration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Average period duration in days'
    },
    usualFlowLevel: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Usual menstrual flow level'
    },
    // Health Conditions
    conditionsPMDD: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Premenstrual Dysphoric Disorder'
    },
    conditionsPMS: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Premenstrual Syndrome'
    },
    conditionsEndometriosis: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    conditionsPCOS: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Polycystic Ovary Syndrome'
    },
    conditionsFibroid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Uterine Fibroid'
    },
    otherConditions: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Other medical conditions or diagnostics'
    },
    // Medications
    medications: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Current medications (comma-separated or JSON)'
    },
    // Additional Notes
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Additional medical notes or history'
    },
    // Original fields for period tracking
    periodStart: {
      type: DataTypes.DATE,
      allowNull: true
    },
    periodEnd: {
      type: DataTypes.DATE,
      allowNull: true
    },
    predicted: {
      type: DataTypes.BOOLEAN
    }
  }, 
  {
    timestamps: true   
  });
};
