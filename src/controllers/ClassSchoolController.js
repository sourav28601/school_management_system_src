var db = require('../db/connectiondb');
const FeatureController = require("../controllers/FeatureController");
const Joi = require('joi');
const { Op } = require('sequelize');
var School = db.school;
var Class = db.class;
var ClassSchool = db.class_school;

class ClassSchoolController {
 
  static AssignClassSchool = async (req, res) => {
    try {
      const assignClassSchoolSchema = Joi.object({
        school_id: Joi.number().required(),
        class_id: Joi.number().required(),
      });

      const { error, value } = assignClassSchoolSchema.validate(req.body);
      if (error) {
        return res.status(400).send({ error: error.details[0].message });
      }

      const { school_id, class_id  } = value;

      const data = await ClassSchool.create({
        school_id: school_id,
        class_id: class_id,
      });
      res.redirect("/admin/all-class-to-school");
    } catch (err) {
      console.error("Error in AssignClassSchool:", err);
      res.status(500).send("An error occurred while assigning class to school.");
    }
  };

  static DisplayAllClassSchool = async (req, res) => {
    try {
      const page = req.query.page || 1;
      const size = req.query.size || 2;
      const searchQuery = req.query.search ? {
        [Op.or]: [
          { class_name: { [Op.like]: `%${req.query.search}%` } },
          { name: { [Op.like]: `%${req.query.search}%` } }
        ]
      } : {};
      let relation = [
        {
          model: Class,
          attributes: ["class_name"],
        },
      ];
      
      const { data:allclasstoschool, currentPage, pageSize, count } = await FeatureController.paginate(
        School,
        page,
        size,
        searchQuery,
        relation
      );
      const totalPages = Math.ceil(count / pageSize);
      const allclasses = await Class.findAll();
      const allschools = await School.findAll();

      const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'ClassSchool', url: '/admin/class_school/class_school' }
      ];
      
      res.render("admin/class_school/class_school", {
        breadcrumbs,
        allclasses: allclasses,
        allschools: allschools,
        allclasstoschool: allclasstoschool,
        page: currentPage, size: pageSize, count, totalPages, searchQuery
      });
    } catch (err) {
      console.error("Error in DisplayAllClassSchool:", err);
      res.status(500).send("An error occurred while fetching class to school associations.");
    }
  };

  static EditClassSchool = async (req, res) => {
    try {
      const schoolId = req.params.id;
      const school = await School.findByPk(schoolId, {
        include: [
          {
            model: Class,
            attributes: ["id", "class_name"],
            through: { attributes: [] }, // Exclude the junction table attributes
          },
        ],
      });
      if (school) {
        const allclasses = await Class.findAll();
        const breadcrumbs = [
          { name: 'Home', url: '/' },
          { name: 'ClassSchool', url: '/admin/class_school/class_school' },
          { name: 'Edit ClassSchool', url: '/admin/class_school/edit_class_school' }
        ];
        res.render("admin/class_school/edit_class_school", {
          breadcrumbs,
          school: school,
          allclasses: allclasses,
        });
      } else {
        res.status(404).send("School not found");
      }
    } catch (err) {
      console.error("Error in EditClassSchool:", err);
      res.status(500).send("An error occurred while fetching class to school associations for editing.");
    }
  };

  static UpdateClassSchool = async (req, res) => {
    try {
      const schoolId = req.params.id;
      const { classes } = req.body;

      // Find the school by ID
      const school = await School.findByPk(schoolId);

      if (school) {
        // Update the school's classes
        await school.setClasses(classes);
        console.log("School classes updated successfully.");
      }
      return res.redirect("/admin/all-class-to-school");
    } catch (err) {
      console.error("Error in UpdateClassSchool:", err);
      res.status(500).send("An error occurred while updating class to school associations.");
    }
  };

  static DeleteClassSchool = async (req, res) => {
    try {
      const schoolId = req.params.id;

      // Find the school by ID
      const school = await School.findByPk(schoolId);

      if (school) {
        await school.setClasses([]); // Remove all class associations
        console.log("School classes deleted successfully.");
      }
      return res.redirect("/admin/all-class-to-school");
    } catch (err) {
      console.error("Error in DeleteClassSchool:", err);
      res.status(500).send("An error occurred while deleting class to school associations.");
    }
  };

}

module.exports = ClassSchoolController;
