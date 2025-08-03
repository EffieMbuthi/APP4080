const { findUserByUsername, validatePassword } = require('../models/user');

async function login(req, res) {
const { username, password } = req.body;
const user = findUserByUsername(username);
if (!user) {
return res.render('login', { error: 'Invalid username or password' });
}
const valid = await validatePassword(user, password);
if (!valid) {
return res.render('login', { error: 'Invalid username or password' });
}
req.session.user = { id: user.id, username: user.username, role: user.role };
res.redirect('/courses');
}

function logout(req, res) {
req.session.destroy(() => {
res.redirect('/login');
});
}

function requireAuth(req, res, next) {
if (!req.session.user) {
return res.redirect('/login');
}
next();
}

function requireInstructor(req, res, next) {
if (req.session.user && req.session.user.role === 'instructor') {
return next();
}
res.status(403).send('Forbidden: Instructors only');
}

function requireAdmin(req, res, next) {
if (req.session.user && req.session.user.role === 'admin') {
return next();
}
res.status(403).send('Forbidden: Administrators only');
}

module.exports = {
login,
logout,
requireAuth,
requireInstructor,
requireAdmin,
};  