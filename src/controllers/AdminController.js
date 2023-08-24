var db = require("../db/connectiondb");
const FeatureController = require("../controllers/FeatureController");
const Joi = require('joi');
var Admin = db.admin;
var Teacher = db.teacher;
var School = db.school;
var Subject = db.subject;
var Class = db.class;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class AdminController {
  static LoginPage = (req, res) => {
    res.render("login",{message:req.flash('error')});
  };
  
  static Dashboard = async (req, res) => {
    try {
      const breadcrumbs = [
        { name: 'Home', url: '/admin/dashboard' },
      ];
      res.render("admin/dashboard",{breadcrumbs});
    } catch (error) {
      console.error("Error in Dashboard:", error);
      res.status(500).send("Internal Server Error");
    }
  };

  static AdminLogin = async (req, res) => {
    try {
      const adminLoginSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      });
      const { error, value } = adminLoginSchema.validate(req.body);

      if (error) {
        req.flash('error', error.details[0].message);
      }
      const { email, password } = value;
      const user = await Admin.findOne({ where: { email: email } });
      if (!user) {
        req.flash('error', 'Invalid email or password');
        return res.redirect("/admin");
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        req.flash('error', 'Invalid email or password');
        return res.redirect("/admin");
      }
      req.session.user = user;
      const token = jwt.sign({ userid: user.id }, "souravrajputrjitgwalior");
      res.cookie("token", token);
      req.flash('success', 'Login successful');
      res.redirect("/admin/dashboard");
    } catch (err) {
      console.error("Error in AdminLogin:", err);
      req.flash('error', 'Internal Server Error');
      res.status(500).redirect("/admin");
    }
  };

  static DisplayAllAssignTeachers = async (req, res) => {
    try {
      const allteachertosubject = await Teacher.findAll({
        include: [
          {
            model: Subject,
            attributes: ["subject_name"],
          },
          {
            model: Class,
            attributes: ["class_name"],
            include: [
              {
                model: School,
                attributes: ["name"],
              },
            ],
          },
        ],
      });

      res.render(
        "admin/teacher_school_class_subject/teacher_school_class_subject",
        {
          allteachertosubject: allteachertosubject,
        }
      );
    } catch (err) {
      console.error("Error in DisplayAllAssignTeachers:", err);
      res.status(500).send("Internal Server Error");
    }
  };
  
}

module.exports = AdminController;
