const { Sequelize, DataTypes, Model } = require("sequelize");
require('dotenv').config();

const sequelize = new Sequelize(process.env.LOCAL_MYSQL_DB, process.env.LOCAL_MYSQL_USER, process.env.LOCAL_MYSQL_PASSWORD, {
  host: process.env.LOCAL_MYSQL_HOST,
  logging: false,
  dialect: process.env.LOCAL_DB_DIALECT,
});

try {
  sequelize.authenticate();
  console.log("connection has been established successfully.");
} catch (error) {
  console.error("unable to connect to the database:", error);
}

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.admin = require("../models/admin")(sequelize, DataTypes, Model);
db.school = require("../models/school")(sequelize, DataTypes, Model);
db.student = require("../models/students")(sequelize, DataTypes, Model);
db.class = require("../models/classes")(sequelize, DataTypes, Model);
db.teacher = require("../models/teachers")(sequelize, DataTypes, Model);
db.subject = require("../models/subjects")(sequelize, DataTypes, Model);
db.class_school = require("../models/class_school")(sequelize, DataTypes, Model);
db.class_subject = require('../models/class_subject')(sequelize, DataTypes, Model);
db.teacher_classes = require('../models/teacher_classes')(sequelize, DataTypes, Model);
db.teacher_subjects = require('../models/teacher_subjects')(sequelize, DataTypes, Model);

// school to students One-To-Many realtionship  
db.school.hasMany(db.student, { foreignKey: "school_id" });
db.student.belongsTo(db.school, { foreignKey: "school_id" });

db.student.belongsTo(db.class, { foreignKey: "class_id" });
db.class.hasMany(db.student, { foreignKey: "class_id" });

// Class To Schools Many To Many Relationship
db.class.belongsToMany(db.school, { through: "class_school", foreignKey: "class_id" }); // Classes can belong to many schools
db.school.belongsToMany(db.class, { through: "class_school", foreignKey: "school_id" }); // Schools can have many classes

// Class To Subjects Many To Many Relationship
db.class.belongsToMany(db.subject, { through: "class_subject", foreignKey: "class_id" });
db.subject.belongsToMany(db.class, { through: "class_subject", foreignKey: "subject_id" });

// Teacher Subjects Relationship Many To Many
db.teacher.belongsToMany(db.subject, { through: "teacher_subjects", foreignKey: "teacher_id" });
db.subject.belongsToMany(db.teacher, { through: "teacher_subjects", foreignKey: "subject_id" });

// Teacher Classes Relationship Many To Many
db.teacher.belongsToMany(db.class, { through: "teacher_classes", foreignKey: "teacher_id" });
db.class.belongsToMany(db.teacher, { through: "teacher_classes", foreignKey: "class_id" });

module.exports = db;
