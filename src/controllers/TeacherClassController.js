var db = require("../db/connectiondb");
const FeatureController = require("../controllers/FeatureController");
const Joi = require('joi');
const { Op } = require("sequelize");
var Teacher = db.teacher;
var Class = db.class;
var TeacherClass = db.teacher_classes;

class TeacherClassSchoolController {
  static AssignClassToTeacher = async (req, res) => {
    try {
      const assignClassToTeacherSchema = Joi.object({
        teacher_id: Joi.number().required(),
        class_id: Joi.number().required(),
      });

      const { error, value } = assignClassToTeacherSchema.validate(req.body);
      if (error) {
        return res.status(400).send({ error: error.details[0].message });
      }

      const { teacher_id, class_id } =  value;
      const data = await TeacherClass.create({
        teacher_id: teacher_id,
        class_id: class_id,
      });

      res.redirect("/admin/all-class-to-teacher");
    } catch (err) {
      console.error("Error in AssignClassToTeacher:", err);
      res.status(500).send({ error: "An error occurred while assigning class to teacher." });
    }
  };

  static DisplayAllClassToTeacher = async (req, res) => {
    try {
      const page = req.query.page || 1;
      const size = req.query.size || 2;
      const searchQuery = req.query.search
        ? {
            [Op.or]: [
              { name: { [Op.like]: `%${req.query.search}%` } },
              { class_name: { [Op.like]: `%${req.query.search}%` } },
            ],
          }
        : {};

      let relation = [
        {
          model: Class,
          attributes: ["class_name"],
        },
      ];
      const {
        data: allteachertoclass,
        currentPage,
        pageSize,
        count,
      } = await FeatureController.paginate(
        Teacher,
        page,
        size,
        searchQuery,
        relation
      );
      const totalPages = Math.ceil(count / pageSize);
      const allteachers = await Teacher.findAll();
      const allclasses = await Class.findAll();
      const breadcrumbs = [
        { name: 'Home', url: '/admin/dashboard' },
        { name: 'All TeacherClass', url: '/admin/all-class-to-teacher' } 
      ];
      res.render("admin/teacher_class/teacher_class", {
        breadcrumbs,
        allclasses: allclasses,
        allteachers: allteachers,
        allteachertoclass: allteachertoclass,
        page: currentPage,
        size: pageSize,
        count,
        totalPages,
        searchQuery,
      });
    } catch (err) {
      console.error("Error in DisplayAllClassToTeacher:", err);
      res.status(500).send({ error: "An error occurred while fetching class to teacher assignments." });
    }
  };

  static EditClassToTeacher = async (req, res) => {
    try {
      const teacherId = req.params.id;
      const teacher = await Teacher.findByPk(teacherId, {
        include: [{ model: Class }],
      });

      const allclasses = await Class.findAll();
      const breadcrumbs = [
        { name: 'Home', url: '/admin/dashboard' },
        { name: 'All TeacherClass', url: '/admin/all-class-to-teacher' },
        { name: 'Edit TeacherClass', url: '/admin/teacher_class/edit_teacher_class' }
      ];
      res.render("admin/teacher_class/edit_teacher_class", {
        breadcrumbs,
        teacher: teacher,
        allclasses: allclasses,
      });
    } catch (err) {
      console.error("Error in EditClassToTeacher:", err);
      res.status(500).send({ error: "An error occurred while editing class to teacher assignment." });
    }
  };

  static UpdateClassToTeacher = async (req, res) => {
    const { teacher_id, class_id } = req.body;
    try {
      const teacherId = req.params.id;
      const { classes } = req.body;
      const teacher = await Teacher.findByPk(teacherId);
      if (teacher) {
        await teacher.setClasses(classes);
        console.log("Teacher class associations updated successfully.");
      }
      res.redirect("/admin/all-class-to-teacher");
    } catch (err) {
      console.error("Error in UpdateClassToTeacher:", err);
      res.status(500).send({ error: "An error occurred while updating class to teacher assignment." });
    }
  };

  static DeleteClassToTeacher = async (req, res) => {
    try {
      const teacherId = req.params.id;
      const teacher = await Teacher.findByPk(teacherId);
      if (teacher) {
        await teacher.setClasses([]); // Remove all class associations
        console.log("Teacher class associations deleted successfully.");
      }

      res.redirect("/admin/all-class-to-teacher");
    } catch (err) {
      console.error("Error in DeleteClassToTeacher:", err);
      res.status(500).send({ error: "An error occurred while deleting class to teacher assignment." });
    }
  };
}

module.exports = TeacherClassSchoolController;
