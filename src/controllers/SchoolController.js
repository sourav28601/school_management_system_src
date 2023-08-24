var db = require('../db/connectiondb');
const FeatureController = require("../controllers/FeatureController");
const Joi = require('joi');
const { Op } = require('sequelize');
var School = db.school;

class SchoolController {

  static AddSchool = async (req, res) => {
    try {
      const addSchoolSchema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required(),
        address: Joi.string().required(),
      });
      const { error, value } = addSchoolSchema.validate(req.body);
      if (error) {
        return res.status(400).send({ error: error.details[0].message });
      }
      
      const { name, email, phone, address } = value;
      const data = new School({
        name: name,
        email: email,
        phone: phone,
        address: address,
      }); 
      await data.save();
      res.redirect("/admin/all-schools");
    } catch (err) {
      console.error("Error in AddSchool:", err);
      res.status(500).send("Failed to add school. Please try again later.");
    }
  };

  static DisplayAllSchools = async (req, res) => {
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
      const { data: allschools, currentPage, pageSize, count } = await FeatureController.paginate(
        School,
        page,
        size,
        searchQuery
      );
      const totalPages = Math.ceil(count / pageSize);
      const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'All Schools', url: '/admin/all-schools' }
      ];
      res.render("admin/schools/schools", {breadcrumbs, allschools, page: currentPage, size: pageSize, count, totalPages, searchQuery });
    } catch (err) {
      console.error("Error in DisplayAllSchools:", err);
      res.status(500).send("Failed to retrieve schools. Please try again later.");
    }
  };

  static EditSchool = async (req, res) => {
    try {
      const school = await School.findOne({ where: { id: req.params.id } });
      const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'All Schools', url: '/admin/all-schools' },
        { name: 'Edit School', url: '/admin/edit-schools' }
      ];
      res.render("admin/schools/editschools", { breadcrumbs, school: school });
    } catch (err) {
      console.error("Error in EditSchool:", err);
      res.status(500).send("Failed to edit school. Please try again later.");
    }
  };

  static UpdateSchool = async (req, res) => {
    try {
      const { name, email, phone, address } = req.body;
      const data = await School.update(
        {
          name: name,
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
      return res.redirect("/admin/all-schools");
    } catch (err) {
      console.error("Error in UpdateSchool:", err);
      res.status(500).send("Failed to update school. Please try again later.");
    }
  };

  static DeleteSchool = async (req, res) => {
    //    console.log(req.params.id);
    try {
      const employee = await School.destroy({ where: { id: req.params.id } });
      return res.redirect("/admin/all-schools");
    } catch (err) {
      console.error("Error in DeleteSchool:", err);
      res.status(500).send("Failed to delete school. Please try again later.");
    }
  };
}

module.exports = SchoolController;
