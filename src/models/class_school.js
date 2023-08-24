'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class class_school extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  class_school.init({
    school_id: DataTypes.INTEGER,
    class_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'class_school',
  });
  return class_school;
};