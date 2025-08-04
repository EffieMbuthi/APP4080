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

// Profile page (same as dashboard for now)
app.get('/profile', (req, res) => {
  if (!req.session.user) return res.redirect('/');
  const dashboardData = getDashboardData(req.session.user);
  res.render('dashboard', dashboardData);
});

// Courses page
app.get('/courses', (req, res) => {
  if (!req.session.user) return res.redirect('/');
  const user = req.session.user;
  let userCourses = [];
  
  if (user.role === 'student') {
    // Get enrolled courses for students
    const enrollments = require('./models/enrollment').getEnrollmentsByStudent(user.username);
    userCourses = courses.getAll().filter(course =>
      enrollments.some(e => e.courseId === course.id)
    );
  } else if (user.role === 'instructor') {
    // Get courses created by instructor
    userCourses = courses.getAll().filter(course => course.instructor === user.username);
  } else if (user.role === 'admin') {
    // Admin sees all courses
    userCourses = courses.getAll();
  }
  
  res.render('dashboard', { 
    user, 
    userCourses, 
    userAssignments: [],
    currentPage: 'courses'
  });
});

// Assignments page
app.get('/assignments', (req, res) => {
  if (!req.session.user) return res.redirect('/');
  const user = req.session.user;
  let userAssignments = [];
  
  if (user.role === 'student') {
    // Get assignments for enrolled courses
    const enrollments = require('./models/enrollment').getEnrollmentsByStudent(user.username);
    const enrolledCourses = courses.getAll().filter(course =>
      enrollments.some(e => e.courseId === course.id)
    );
    userAssignments = assignments.getAll().filter(assignment =>
      enrolledCourses.some(course => course.id === assignment.courseId)
    );
  } else if (user.role === 'instructor') {
    // Get assignments for courses created by instructor
    const instructorCourses = courses.getAll().filter(course => course.instructor === user.username);
    userAssignments = assignments.getAll().filter(assignment =>
      instructorCourses.some(course => course.id === assignment.courseId)
    );
  } else if (user.role === 'admin') {
    // Admin sees all assignments
    userAssignments = assignments.getAll();
  }
  
  res.render('dashboard', { 
    user, 
    userCourses: [],
    userAssignments,
    currentPage: 'assignments'
  });
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