var db = require('../db/connectiondb');
const FeatureController = require("../controllers/FeatureController");
const Joi = require('joi');
const { Op } = require('sequelize');
var Teacher = db.teacher;
class TeacherController {
  static AddTeacher = async (req, res) => {
    try {
      const addTeacherSchema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required(),
        address: Joi.string().required(),
      });
      
      const { error, value } = addTeacherSchema.validate(req.body);

      if (error) {
        return res.status(400).send({ error: error.details[0].message });
      }
      const { name, email, phone, address } = value;

      const data = new Teacher({
        name: name,
        email: email,
        phone: phone,
        address: address
      });
      await data.save();
      res.redirect("/admin/all-teachers");
    } catch (err) {
      console.error("Error in AddTeacher:", err);
      res.status(500).send({ error: "An error occurred while adding teacher." });
    }
  };
  static DisplayAllTeachers = async (req, res) => {
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
      const { data: allTeachers, currentPage, pageSize, count } = await FeatureController.paginate(
        Teacher,
        page,
        size,
        searchQuery
      );
      const totalPages = Math.ceil(count / pageSize);
      const breadcrumbs = [
        { name: 'Home', url: '/admin/dashboard' },
        { name: 'All Teachers', url: '/admin/all-teachers' }
      ];
      res.render("admin/teachers/teachers", {breadcrumbs,
        allTeachers, page: currentPage, size: pageSize, count, totalPages, searchQuery
      });
    } catch (err) {
      console.error("Error in DisplayAllTeachers:", err);
      res.status(500).send({ error: "An error occurred while fetching teachers." });
    }
  };

  static EditTeacher = async (req, res) => {
    try {
      const teacher = await Teacher.findOne({
        where: { id: req.params.id },
      });
      const breadcrumbs = [
        { name: 'Home', url: '/admin/dashboard' },
        { name: 'All Teachers', url: '/admin/all-teachers' },
        { name: 'Edit Teacher', url: '/admin/teachers/editteachers' }
      ];
      res.render("admin/teachers/editteachers", {breadcrumbs, teacher: teacher });
    } catch (err) {
      console.error("Error in EditTeacher:", err);
      res.status(500).send({ error: "An error occurred while editing teacher." });
    }
  };

  static UpdateTeacher = async (req, res) => {
    const { name, email, phone, address} = req.body;
    try {
      const data = await Teacher.update(
        {
          name: name,
          email: email,
          phone : phone,
          address: address
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      console.log(data);
      return res.redirect("/admin/all-teachers");
    } catch (err) {
      console.error("Error in UpdateTeacher:", err);
      res.status(500).send({ error: "An error occurred while updating teacher." });
    }
  };

  static DeleteTeacher = async (req, res) => {
    try {
      const teacher = await Teacher.destroy({ where: { id: req.params.id } });
      return res.redirect("/admin/all-teachers");
    } catch (err) {
      console.error("Error in DeleteTeacher:", err);
      res.status(500).send({ error: "An error occurred while deleting teacher." });
    }
  };
}

module.exports = TeacherController;
