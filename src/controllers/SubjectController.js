var db = require('../db/connectiondb');
const { Op } = require('sequelize');
const FeatureController = require("../controllers/FeatureController");
const Joi = require('joi');
var Subject = db.subject;

class SubjectController {
  static AddSubject = async (req, res) => {
    try {
      const addSubjectSchema = Joi.object({
        subject_name: Joi.string().required(),
      });
      const { error, value } = addSubjectSchema.validate(req.body);
      if (error) {
        return res.status(400).send({ error: error.details[0].message });
      }

      const { subject_name } = value;
      const data = new Subject({
        subject_name: subject_name,
      });
      await data.save();
      res.redirect("/admin/all-subjects");
    } catch (err) {
      console.error("Error in AddSubject:", err);
      res.status(500).send({ error: "An error occurred while adding a subject." });
    }
  };

  static DisplayAllSubjects = async (req, res) => {
    try {
      const page = req.query.page || 1;
      const size = req.query.size || 2;
      const searchQuery = req.query.search ? {
        subject_name: { [Op.like]: `%${req.query.search}%` },
      } : {};

      const { data: allsubjects, currentPage, pageSize, count } = await FeatureController.paginate(
        Subject,
        page,
        size,
        searchQuery
      );
      const totalPages = Math.ceil(count / pageSize);
      const breadcrumbs = [
        { name: 'Home', url: '/admin/dashboard' },
        { name: 'All Subjects', url: '/admin/all-subjects' },
      ];
      res.render("admin/subjects/subjects", { breadcrumbs, allsubjects, page: currentPage, size: pageSize, count, totalPages, searchQuery });
    } catch (err) {
      console.error("Error in DisplayAllSubjects:", err);
      res.status(500).send({ error: "An error occurred while fetching subjects." });
    }
  };

  static EditSubject = async (req, res) => {
    try {
      const subject = await Subject.findOne({ where: { id: req.params.id } });
      const breadcrumbs = [
        { name: 'Home', url: '/admin/dashboard' },
        { name: 'All Subjects', url: '/admin/all-subjects' },
        { name: 'Edit Subject', url: '/admin/subjects/editsubjects' }
      ];
      res.render("admin/subjects/editsubjects", {  breadcrumbs, subject: subject });
    } catch (err) {
      console.error("Error in EditSubject:", err);
      res.status(500).send({ error: "An error occurred while editing the subject." });
    }
  };

  static UpdateSubject = async (req, res) => {
    const { subject_name } = req.body;
    try {
      const data = await Subject.update(
        {
          subject_name: subject_name,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      console.log(data);
      return res.redirect("/admin/all-subjects");
    } catch (err) {
      console.error("Error in UpdateSubject:", err);
      res.status(500).send({ error: "An error occurred while updating the subject." });
    }
  };

  static DeleteSubject = async (req, res) => {
    try {
      const subject = await Subject.destroy({ where: { id: req.params.id } });
      return res.redirect("/admin/all-subjects");
    } catch (err) {
      console.error("Error in DeleteSubject:", err);
      res.status(500).send({ error: "An error occurred while deleting the subject." });
    }
  };
}

module.exports = SubjectController;
