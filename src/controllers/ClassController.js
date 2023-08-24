var db = require("../db/connectiondb");
const FeatureController = require("../controllers/FeatureController");
const Joi = require('joi');
var School = db.school;
const { Op } = require("sequelize");
var Class = db.class;

class ClassController {
  static AddClass = async (req, res) => {
    try {
      const addClassSchema = Joi.object({
        class_name: Joi.string().required(),
      });

      const { error, value } = addClassSchema.validate(req.body);
      if (error) {
        return res.status(400).send({ error: error.details[0].message });
      }
      
      const { class_name } = value;
      const data = new Class({
        class_name: class_name,
      });
      await data.save();
      res.redirect("/admin/all-classes");
    } catch (err) {
      console.error("Error in AddClass:", err);
      res.status(500).send("Failed to add class. Please try again later.");
    }
  };

  static DisplayAllClasses = async (req, res) => {
    try {
      const page = req.query.page || 1;
      const size = req.query.size || 2;

      const searchQuery = req.query.search
        ? {
            class_name: { [Op.like]: `%${req.query.search}%` },
          }
        : {};

      const {
        data: allclasses,
        currentPage,
        pageSize,
        count,
      } = await FeatureController.paginate(Class, page, size, searchQuery);
      const totalPages = Math.ceil(count / pageSize);
      const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Classes', url: '/admin/all-classes' },
      ];
      res.render("admin/classes/classes", {
        allclasses,
        breadcrumbs,
        page: currentPage,
        size: pageSize,
        count,
        totalPages,
        searchQuery,
      });
    } catch (err) {
      console.error("Error in DisplayAllClasses:", err);
      res.status(500).send("Failed to retrieve classes.. Please try again later.");
    }
  };

  static EditClass = async (req, res) => {
    try {
      const classes = await Class.findOne({
        where: { id: req.params.id },
      });
      const breadcrumbs = [
        { name: 'Home', url: '/admin/dashboard' },
        { name: 'Classes', url: '/admin/all-classes' },
        { name: 'Edit Class', url: '/admin/classes/editclasses' }, 
      ];
      res.render("admin/classes/editclasses", { classes: classes, breadcrumbs });
    } catch (err) {
      console.error("Error in EditClass:", err);
      res.status(500).send("Failed to edit class. Please try again later.");
    }
  };

  static UpdateClass = async (req, res) => {
    try {
      const { class_name } = req.body;
      const data = await Class.update(
        {
          class_name: class_name,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      return res.redirect("/admin/all-classes");
    } catch (err) {
      console.error("Error in UpdateClass:", err);
      res.status(500).send("Failed to update class. Please try again later.");
    }
  };

  static DeleteClass = async (req, res) => {
    try {
      const student = await Class.destroy({ where: { id: req.params.id } });
      return res.redirect("/admin/all-classes");
    } catch (err) {
      console.error("Error in DeleteClass:", err);
      res.status(500).send("Failed to delete class. Please try again later.");
    }
  };
}

module.exports = ClassController;
