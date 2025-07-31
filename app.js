const express = require('express');
const session = require('express-session');
const path = require('path');

const users = require('./models/user');
const courses = require('./models/course');
const assignments = require('./models/assignment');
const submissions = require('./models/submission');

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
  if (user) {
    req.session.user = user;
    res.redirect('/dashboard');
  } else {
    res.render('login', { error: 'Invalid user' });
  }
});

// Dashboard
app.get('/dashboard', (req, res) => {
  if (!req.session.user) return res.redirect('/');
  const user = req.session.user;
  let userAssignments = [];
  let userSubmissions = [];
  if (user.role === 'student') {
    userAssignments = assignments;
    userSubmissions = submissions.getByStudent(user.username);
  } else if (user.role === 'instructor') {
    userAssignments = assignments.filter(a => courses.find(c => c.id === a.courseId && c.instructor === user.username));
    userSubmissions = submissions.getAll();
  }
  res.render('dashboard', { user, userAssignments, userSubmissions });
});

// Assignment submission (students)
app.get('/assignment/:id', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'student') return res.redirect('/');
  const assignment = assignments.find(a => a.id == req.params.id);
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

app.listen(3000, () => console.log('Mini LMS running on http://localhost:3000'));