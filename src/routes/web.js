const express = require('express');
const router = express.Router();

const AdminController = require('../controllers/AdminController');
const SchoolController = require('../controllers/SchoolController');
const StudentController = require('../controllers/StudentController');
const SubjectController = require('../controllers/SubjectController');
const ClassController = require('../controllers/ClassController');
const TeacherController = require('../controllers/TeacherController');
const ClassSchoolController = require('../controllers/ClassSchoolController');
const ClassSubjectController = require('../controllers/ClassSubjectController');
const TeacherClassController = require('../controllers/TeacherClassController');
const TeacherSubjectController = require('../controllers//TeacherSubjectController');

// middleware
const checkUserAuth = require('../middleware/auth');

// AdminController
router.get('/', AdminController.LoginPage);
router.post('/admin-login', AdminController.AdminLogin);
router.get('/dashboard',checkUserAuth, AdminController.Dashboard);
router.get('/all-assign-teachers',AdminController.DisplayAllAssignTeachers);

//SchoolController
router.get('/all-schools',checkUserAuth, SchoolController.DisplayAllSchools);
router.post('/add-schools',checkUserAuth, SchoolController.AddSchool);
router.get('/edit-schools/:id',checkUserAuth, SchoolController.EditSchool);
router.post('/update-schools/:id',checkUserAuth, SchoolController.UpdateSchool);
router.get('/delete-schools/:id',checkUserAuth, SchoolController.DeleteSchool);


//StudentController
router.get('/all-students',checkUserAuth, StudentController.DisplayAllStudents);
router.post('/add-students',checkUserAuth, StudentController.AddStudent);
router.get('/edit-students/:id',checkUserAuth, StudentController.EditStudent);
router.post('/update-students/:id',checkUserAuth, StudentController.UpdateStudent);
router.get('/delete-students/:id',checkUserAuth, StudentController.DeleteStudent);

//SubjectController
router.get('/all-subjects',checkUserAuth, SubjectController.DisplayAllSubjects);
router.post('/add-subjects',checkUserAuth, SubjectController.AddSubject);
router.get('/edit-subjects/:id',checkUserAuth, SubjectController.EditSubject);
router.post('/update-subjects/:id',checkUserAuth, SubjectController.UpdateSubject);
router.get('/delete-subjects/:id',checkUserAuth, SubjectController.DeleteSubject);



//ClassController
router.get('/all-classes',checkUserAuth, ClassController.DisplayAllClasses);
router.post('/add-classes',checkUserAuth, ClassController.AddClass);
router.get('/edit-classes/:id',checkUserAuth, ClassController.EditClass);
router.post('/update-classes/:id',checkUserAuth, ClassController.UpdateClass);
router.get('/delete-classes/:id',checkUserAuth, ClassController.DeleteClass);

//TeacherController
router.get('/all-teachers',checkUserAuth, TeacherController.DisplayAllTeachers);
router.post('/add-teachers',checkUserAuth, TeacherController.AddTeacher);
router.get('/edit-teachers/:id',checkUserAuth, TeacherController.EditTeacher);
router.post('/update-teachers/:id',checkUserAuth, TeacherController.UpdateTeacher);
router.get('/delete-teachers/:id',checkUserAuth, TeacherController.DeleteTeacher);



// ClassSchoolController
router.get('/all-class-to-school',checkUserAuth, ClassSchoolController.DisplayAllClassSchool);
router.post('/assign-class-to-school',checkUserAuth, ClassSchoolController.AssignClassSchool);
router.get('/edit-class-school/:id',checkUserAuth, ClassSchoolController.EditClassSchool);
router.post('/update-class-school/:id',checkUserAuth, ClassSchoolController.UpdateClassSchool);
router.get('/delete-class-school/:id',checkUserAuth, ClassSchoolController.DeleteClassSchool);


// ClassSubjectController
router.get('/all-class-to-subject',checkUserAuth, ClassSubjectController.DisplayAllClassToSubject);
router.post('/assign-class-to-subject',checkUserAuth, ClassSubjectController.AssignClassToSubject);
router.get('/edit-class-to-subject/:id',checkUserAuth, ClassSubjectController.EditClassToSubject);
router.post('/update-class-to-subject/:id',checkUserAuth, ClassSubjectController.UpdateClassToSubject);
router.get('/delete-class-to-subject/:id',checkUserAuth, ClassSubjectController.DeleteClassToSubject);



// TeacherSubjectController
router.get('/all-teacher-to-subject',checkUserAuth,TeacherSubjectController.DisplayAllSubjectsToTeacher);
router.post('/assign-subject-to-teacher',checkUserAuth, TeacherSubjectController.AssignSubjectToTeacher);
router.get('/edit-subject-to-teacher/:id',checkUserAuth, TeacherSubjectController.EditAssignSubjectsToTeacher);
router.post('/update-subject-to-teacher/:id',checkUserAuth, TeacherSubjectController.UpdateAssignSubjectsToTeacher);
router.get('/admin/delete-subject-to-teacher/:id',checkUserAuth, TeacherSubjectController.DeleteAssignSubjectsToTeacher);



// TeacherClassSchoolController
router.get('/all-class-to-teacher',checkUserAuth,TeacherClassController.DisplayAllClassToTeacher);
router.post('/assign-class-to-teacher',checkUserAuth, TeacherClassController.AssignClassToTeacher);
router.get('/edit-class-to-teacher/:id',checkUserAuth, TeacherClassController.EditClassToTeacher);
router.post('/update-class-to-teacher/:id',checkUserAuth, TeacherClassController.UpdateClassToTeacher);
router.get('/delete-class-to-teacher/:id',checkUserAuth, TeacherClassController.DeleteClassToTeacher);


module.exports = router;


