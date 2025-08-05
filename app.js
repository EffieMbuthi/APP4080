const express = require('express');
const session = require('express-session');
const path = require('path');

const users = require('./models/user');
const courses = require('./models/course');
const assignments = require('./models/assignment');
const submissions = require('./models/submission');
const { getDashboardData } = require('./Controlllers/dashboardController');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({ secret: 'mini-lms', resave: false, saveUninitialized: true }));

// Login page
app.get('/', (req, res) => res.render('login'));
app.post('/login', (req, res) => {
  const user = users.find(u => u.username === req.body.username);
  if (user && req.body.password) {
    req.session.user = user;
    res.redirect('/dashboard');
  } else {
    res.render('login', { error: 'Invalid username or password' });
  }
});

// Dashboard
app.get('/dashboard', (req, res) => {
  if (!req.session.user) return res.redirect('/');
  const dashboardData = getDashboardData(req.session.user);
  res.render('dashboard', dashboardData);
});

// Courses page
app.get('/courses', (req, res) => {
  if (!req.session.user) return res.redirect('/');
  const user = req.session.user;
  let userCourses = [];
  const enrollment = require('./models/enrollment');
  
  if (user.role === 'student') {
    // Students see all courses but only enrolled ones are marked
    userCourses = courses.getAll();
  } else if (user.role === 'instructor') {
    // Instructors see only courses assigned to them
    userCourses = courses.getAll().filter(course => course.instructor === user.username);
  } else if (user.role === 'admin') {
    // Admin sees all courses
    userCourses = courses.getAll();
  }
  
  // Get enrollment status for each course (for students)
  const coursesWithEnrollment = userCourses.map(course => ({
    ...course,
    isEnrolled: user.role === 'student' ? enrollment.isEnrolled(course.id, user.username) : false
  }));
  
  res.render('dashboard', { 
    user, 
    userCourses: coursesWithEnrollment, 
    userAssignments: [],
    currentPage: 'courses'
  });
});

// Assignments page
app.get('/assignments', (req, res) => {
  if (!req.session.user) return res.redirect('/');
  const user = req.session.user;
  let userAssignments = [];
  let instructorCourses = [];
  
  if (user.role === 'student') {
    // Students see assignments only for enrolled courses
    const enrollments = require('./models/enrollment').getEnrollmentsByStudent(user.username);
    const enrolledCourses = courses.getAll().filter(course =>
      enrollments.some(e => e.courseId === course.id)
    );
    userAssignments = assignments.getAll().filter(assignment =>
      enrolledCourses.some(course => course.id === assignment.courseId)
    ).map(assignment => {
      const course = courses.getById(assignment.courseId);
      return {
        ...assignment,
        courseCode: course ? course.code : 'N/A'
      };
    });
  } else if (user.role === 'instructor') {
    // Instructors see assignments for courses assigned to them
    const instructorCourses = courses.getAll().filter(course => course.instructor === user.username);
    userAssignments = assignments.getAll().filter(assignment =>
      instructorCourses.some(course => course.id === assignment.courseId)
    ).map(assignment => {
      const course = courses.getById(assignment.courseId);
      return {
        ...assignment,
        courseCode: course ? course.code : 'N/A'
      };
    });
  } else if (user.role === 'admin') {
    // Admin sees all assignments
    userAssignments = assignments.getAll().map(assignment => {
      const course = courses.getById(assignment.courseId);
      return {
        ...assignment,
        courseCode: course ? course.code : 'N/A'
      };
    });
  }
  
  // Get instructor courses for assignment creation form
  if (user.role === 'instructor') {
    instructorCourses = courses.getAll().filter(course => course.instructor === user.username);
  }
  
  res.render('dashboard', { 
    user, 
    userCourses: [],
    userAssignments,
    instructorCourses,
    currentPage: 'assignments'
  });
});

// Course enrollment (for students)
app.post('/courses/:id/enroll', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'student') return res.redirect('/');
  const courseId = parseInt(req.params.id);
  const enrollment = require('./models/enrollment');
  
  if (!enrollment.isEnrolled(courseId, req.session.user.username)) {
    enrollment.enrollStudent(courseId, req.session.user.username);
  }
  
  res.redirect('/courses');
});

// Course unenrollment (for students)
app.post('/courses/:id/unenroll', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'student') return res.redirect('/');
  const courseId = parseInt(req.params.id);
  const enrollment = require('./models/enrollment');
  
  enrollment.unenrollStudent(courseId, req.session.user.username);
  res.redirect('/courses');
});

// Create course (for admin only)
app.post('/courses/create', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') return res.redirect('/');
  
  const { code, title, instructor } = req.body;
  if (code && title && instructor) {
    courses.create({ code, title, instructor });
  }
  
  res.redirect('/courses');
});

// Create assignment (for instructors only)
app.post('/assignments/create', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'instructor') return res.redirect('/');
  
  const { title, description, courseId } = req.body;
  if (title && description && courseId) {
    // Verify instructor is assigned to this course
    const course = courses.getById(parseInt(courseId));
    if (course && course.instructor === req.session.user.username) {
      assignments.create({ title, description, courseId: parseInt(courseId) });
    }
  }
  
  res.redirect('/assignments');
});

// Assignment submission (students)
app.get('/assignment/:id', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'student') return res.redirect('/');
  const assignment = assignments.getById(parseInt(req.params.id));
  res.render('assignment', { assignment });
});

app.post('/assignment/:id/submit', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'student') return res.redirect('/');
  submissions.add({
    assignmentId: parseInt(req.params.id),
    student: req.session.user.username,
    content: req.body.content,
    timestamp: new Date()
  });
  res.redirect('/dashboard');
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

app.listen(3001, () => console.log('Mini LMS running on http://localhost:3001'));