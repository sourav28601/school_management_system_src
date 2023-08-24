var db = require('../db/connectiondb');
const FeatureController = require("../controllers/FeatureController");
const Joi = require('joi');
const { Op } = require('sequelize');
var Subject = db.subject;
var Teacher = db.teacher;
var TeacherSubject = db.teacher_subjects;

class TeacherSubjectController {
  static AssignSubjectToTeacher = async (req, res) => {
    try {
      const assignSubjectToTeacherSchema = Joi.object({
        teacher_id: Joi.number().required(),
        subject_id: Joi.number().required(),
      });
      const { error, value } = assignSubjectToTeacherSchema.validate(req.body);
      if (error) {
        return res.status(400).send({ error: error.details[0].message });
      }
      const { teacher_id, subject_id } = value;
      const data = await TeacherSubject.create({
        teacher_id: teacher_id,
        subject_id: subject_id,
      });
      
      res.redirect("/admin/all-teacher-to-subject");
    } catch (err) {
      console.error("Error in AssignSubjectToTeacher:", err);
      res.status(500).send({ error: "An error occurred." });
    }

  };

  static DisplayAllSubjectsToTeacher = async (req, res) => {
    try {
      const page = req.query.page || 1;
      const size = req.query.size || 2;
      const searchQuery = req.query.search ? {
        [Op.or]: [
          { name: { [Op.like]: `%${req.query.search}%` } },
          { subject_name: { [Op.like]: `%${req.query.search}%` } },
        ]
      } : {};

      let relation = [
        {
          model: Subject,
          attributes: ["subject_name"],
        },
      ];
      
      const whereClause = searchQuery ? {
        subject_name: { [Op.like]: `%${searchQuery}%` },
      } : {};
      
      const { data:allteachertosubject, currentPage, pageSize, count } = await FeatureController.paginate(
        Teacher,
        page,
        size,
        searchQuery,
        relation  
        );
      const totalPages = Math.ceil(count / pageSize);
      const allteachers = await Teacher.findAll();
      const allsubjects = await Subject.findAll();
      const breadcrumbs = [
        { name: 'Home', url: '/admin/dashboard' },
        { name: 'TeacherSubjects', url: '/admin/all-teacher-to-subject' }
      ];
      res.render("admin/teacher_subject/teacher_subject", {
        breadcrumbs,
        allteachers: allteachers,
        allsubjects: allsubjects,
        allteachertosubject: allteachertosubject,
        page: currentPage, size: pageSize, count, totalPages, searchQuery
      });
    } catch (err) {
      console.error("Error in DisplayAllSubjectsToTeacher:", err);
      res.status(500).send({ error: "An error occurred while fetching data." });
    }
  };

  static EditAssignSubjectsToTeacher = async (req, res) => {
    try {

      const teacherId = req.params.id;
      const teacher = await Teacher.findByPk(teacherId, {
        include: [{ model: Subject }],
      });
      const allsubjects = await Subject.findAll();
      const breadcrumbs = [
        { name: 'Home', url: '/admin/dashboard' },
        { name: 'TeacherSubjects', url: '/admin/all-teacher-to-subject' },
        { name: 'Edit TeacherSubjects', url: '/admin/teacher_subject/edit_teacher_subject' }
      ];
    res.render("admin/teacher_subject/edit_teacher_subject", {
       breadcrumbs,
        teacher: teacher,
        allsubjects: allsubjects,
    });
    } catch (err) {
      console.error("Error in EditAssignSubjectsToTeacher:", err);
      res.status(500).send({ error: "An error occurred while editing data." });
    }
  };

  static UpdateAssignSubjectsToTeacher = async (req, res) => {
    try {
        // Find the TeacherSubject record by ID
        const teacherId = req.params.id;
        const { subjects } = req.body;
        const teacher = await Teacher.findByPk(teacherId);
        console.log(teacher);
        if (teacher) {
          const selectedSubjects = await Subject.findAll({
            where: {
              id: subjects, // Assuming 'subjects' is an array of selected subject IDs
            },
          });
          await teacher.setSubjects(selectedSubjects);

        }
        return res.redirect("/admin/all-teacher-to-subject");
    } catch (err) {
      console.error("Error in UpdateAssignSubjectsToTeacher:", err);
      res.status(500).send({ error: "An error occurred while updating data." });
    }
  };

  static DeleteAssignSubjectsToTeacher = async (req, res) => {
    try { 
      const teacherId = req.params.id;
      const teacher = await Teacher.findByPk(teacherId);
      if (teacher) {
        await teacher.setSubjects([]); // Remove all class associations
        console.log("Teacher subjects associations deleted successfully.");
      }
      return res.redirect("/admin/all-teacher-to-subject");
    } catch (err) {
      console.error("Error in DeleteAssignSubjectsToTeacher:", err);
      res.status(500).send({ error: "An error occurred while deleting data." });
    }
  };
}

module.exports = TeacherSubjectController;
