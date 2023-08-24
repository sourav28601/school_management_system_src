var db = require('../db/connectiondb');
const FeatureController = require("../controllers/FeatureController");
const Joi = require('joi');
const { Op } = require('sequelize');
var Subject = db.subject;
var Class = db.class;
var ClassSchool = db.class_school;
var ClassSubject = db.class_subject;

class ClassSchoolSubjectController {

  static AssignClassToSubject = async (req, res) => {
    try {
      const assignClassToSubjectSchema = Joi.object({
        class_id: Joi.number().required(),
        subject_id: Joi.number().required(),
      });
      const { error, value } = assignClassToSubjectSchema.validate(req.body);
      if (error) {
        return res.status(400).send({ error: error.details[0].message });
      }
      const { class_id, subject_id } = value;
      const data = await ClassSubject.create({
        class_id: class_id,
        subject_id: subject_id,
      });
      res.redirect("/admin/all-class-to-subject");
    } catch (err) {
      console.error("Error in AssignClassToSubject:", err);
      res.status(500).send("An error occurred while assigning class to subject.");
    }
  };

  static DisplayAllClassToSubject = async (req, res) => {
    try {
      const page = req.query.page || 1;
      const size = req.query.size || 2;
      const searchQuery = req.query.search ? {
        [Op.or]: [
          { class_name: { [Op.like]: `%${req.query.search}%` } },
          { name: { [Op.like]: `%${req.query.search}%` } },
        ]
      } : {};
      let relation = [
        {
          model: Subject,
          attributes: ["subject_name"],
        }
      ];
      const { data: allsubjecttoclass, currentPage, pageSize, count } = await FeatureController.paginate(
        Class,
        page,
        size,
        searchQuery,
        relation
        );
      const totalPages = Math.ceil(count / pageSize);
      
      const allclasses = await Class.findAll();
      const allsubjects = await Subject.findAll();

      const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'ClassSubject', url: '/admin/class_subject/class_subject' }
      ];
      
      res.render("admin/class_subject/class_subject", {
        breadcrumbs,
        allsubjecttoclass: allsubjecttoclass,
        allsubjects: allsubjects,
        allclasses: allclasses,
        page: currentPage, size: pageSize, count, totalPages, searchQuery 
      });
    } catch (err) {
      console.error("Error in DisplayAllClassToSubject:", err);
      res.status(500).send("An error occurred while fetching class to subject associations.");
    }
  };

  static EditClassToSubject = async (req, res) => {
    try {
      const classId = req.params.id;
      const classData = await Class.findByPk(classId, {
        include: [{ model: Subject }],
      });

      if (classData) {
        const allsubjects = await Subject.findAll();
        const breadcrumbs = [
          { name: 'Home', url: '/' },
          { name: 'ClassSubject', url: '/admin/class_subject/class_subject' },
          { name: 'Edit ClassSubject', url: '/admin/class_subject/edit_class_subject' }
        ];
        res.render("admin/class_subject/edit_class_subject", {
          breadcrumbs,
          classData: classData,
          allsubjects: allsubjects,
        });
      } else {
        console.error("Error in EditClassToSubject:", err);
        res.status(500).send("An error occurred while fetching class to subject associations for editing.");
      }
     
    } catch (err) {
      console.log(err);
    }
  };

  static UpdateClassToSubject = async (req, res) => {
    try {

      const classId = req.params.id;
      const { subjects } = req.body;
      const classData = await Class.findByPk(classId);
      if (classData) {
        await classData.setSubjects(subjects);
        console.log("Class subject associations updated successfully.");
      }
      res.redirect("/admin/all-class-to-subject");
    } catch (err) {
      console.error("Error in UpdateClassToSubject:", err);
      res.status(500).send("An error occurred while updating class to subject associations.");
    }
  };

  static DeleteClassToSubject = async (req, res) => {
    try {
      const classId = req.params.id;
      const classData = await Class.findByPk(classId);
      if (classData) {
        await classData.setSubjects([]); // Remove all subject associations
        console.log("Class subject associations deleted successfully.");
      }
      res.redirect("/admin/all-class-to-subject");
    } catch (err) {
      console.error("Error in DeleteClassToSubject:", err);
      res.status(500).send("An error occurred while deleting class to subject associations.");
    }
  };
}

module.exports = ClassSchoolSubjectController;
