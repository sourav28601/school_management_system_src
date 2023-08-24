var db = require('../db/connectiondb');
const FeatureController = require("../controllers/FeatureController");
const Joi = require('joi');
const { Op } = require('sequelize');
var Student = db.student;
var School = db.school;
var Class = db.class;

class StudentController {
  
  static AddStudent = async (req, res) => {
    try {
      const addStudentSchema = Joi.object({
        school_id: Joi.number().required(),
        class_id: Joi.number().required(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required(),
        address: Joi.string().required(),
      });
      const { error, value } = addStudentSchema.validate(req.body);
      if (error) {
        return res.status(400).send({ error: error.details[0].message });
      }
      const {
        school_id,
        class_id,
        firstname,
        lastname,
        email,
        phone,
        address,
      } = value;
      const data = new Student({
        school_id: school_id,
        class_id: class_id,
        firstname: firstname,
        lastname: lastname,
        email: email,
        phone: phone,
        address: address,
      });
      await data.save();
      res.redirect("/admin/all-students");
    } catch (err) {
      console.error("Error in AddStudent:", err);
      res.status(500).send("An error occurred while adding a student.");
    }
  };

  static DisplayAllStudents = async (req, res) => {
    try {
      const page = req.query.page || 1;
      const size = req.query.size || 2;
      const searchQuery = req.query.search ? {
        [Op.or]: [
          { name: { [Op.like]: `%${req.query.search}%` } },
          { email: { [Op.like]: `%${req.query.search}%` } },
          { phone: { [Op.like]: `%${req.query.search}%` } }
        ]
      } : {};
      let relation = [
        {
          model: School,
          attributes: ["name"],
        },
        {
          model: Class,
          attributes: ["class_name"],
        },
      ];
      const { data: allstudents, currentPage, pageSize, count } = await FeatureController.paginate(
        Student,
        page,
        size,
        searchQuery,
        relation
        );
      const totalPages = Math.ceil(count / pageSize);
 
      const allschools = await School.findAll();
      const allclasses = await Class.findAll();
      const breadcrumbs = [
        { name: 'Home', url: '/admin/dashboard' },
        { name: 'All Students', url: '/admin/all-students' }
      ];
      res.render("admin/students/students", {  breadcrumbs, allstudents: allstudents, allschools:allschools, allclasses:allclasses,page: currentPage, size: pageSize, count, totalPages, searchQuery  });
    } catch (err) {
      console.error("Error in DisplayAllStudents:", err);
      res.status(500).send("An error occurred while fetching students.");
    }
  };

  static EditStudent = async (req, res) => {
    try {
      const student = await Student.findOne({
        where: { id: req.params.id },
        include: School,
      });

      const schools = await School.findAll();
      const allclasses = await Class.findAll();
      const breadcrumbs = [
        { name: 'Home', url: '/admin/dashboard' },
        { name: 'All Students', url: '/admin/all-students' },
        { name: 'Edit Student', url: '/admin/edit-students' }
      ];
      res.render("admin/students/editstudents", {
        breadcrumbs,
        student: student,
        schools: schools,
        allclasses: allclasses,
      });
    } catch (err) {
      console.error("Error in EditStudent:", err);
      res.status(500).send("An error occurred while fetching student details for editing.");
    }
  };

  static UpdateStudent = async (req, res) => {
    try {
      const { school_id, firstname, lastname, email, phone, address } =
        req.body;
      const data = await Student.update(
        {
          school_id: school_id,
          firstName: firstname,
          lastName: lastname,
          email: email,
          phone: phone,
          address: address,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      return res.redirect("/admin/all-students");
    } catch (err) {
      console.error("Error in UpdateStudent:", err);
      res.status(500).send("An error occurred while updating student details.");
    }
  };

  static DeleteStudent = async (req, res) => {

    try {
      const studentId = req.params.id;
      console.log(studentId);
      const student = await Student.destroy({ where: { id: studentId } });
      return res.redirect("/admin/all-students");
    } catch (err) {
      console.error("Error in DeleteStudent:", err);
      res.status(500).send("An error occurred while deleting the student.");
    }
  };
  
}

module.exports = StudentController;
