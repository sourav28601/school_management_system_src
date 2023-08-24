'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class teacher_classes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  teacher_classes.init({
    teacher_id: DataTypes.INTEGER,
    class_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'teacher_classes',
  });
  return teacher_classes;
};