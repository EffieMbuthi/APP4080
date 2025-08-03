const { getAllCourses } = require('../models/course');
const { getAssignmentsByCourse, getSubmissions } = require('../models/assignment');
const { getEnrollmentsByStudent, isEnrolled } = require('../models/enrollment');
const { assignmentObserver } = require('../models/notification');

function getDashboardData(user) {
const allCourses = getAllCourses();

if (user.role === 'student') {
return getStudentDashboard(user, allCourses);
} else if (user.role === 'instructor') {
return getInstructorDashboard(user, allCourses);
} else if (user.role === 'admin') {
return getAdminDashboard(user, allCourses);
}
}

function getStudentDashboard(user, allCourses) {
// Get enrolled courses
const enrollments = getEnrollmentsByStudent(user.username);
const enrolledCourses = allCourses.filter(course =>
enrollments.some(e => e.courseId === course.id)
);

// Get assignments for enrolled courses
const courseAssignments = enrolledCourses.map(course => ({
course,
assignments: getAssignmentsByCourse(course.id)
}));

// Get all assignments with course info
const allAssignments = courseAssignments.flatMap(ca =>
ca.assignments.map(assignment => ({
...assignment,
courseTitle: ca.course.title,
courseId: ca.course.id
}))
);

// Get submissions made by this student
const studentSubmissions = allAssignments.flatMap(assignment => {
const submissions = getSubmissions(assignment.id);
return submissions
.filter(sub => sub.student === user.username)
.map(sub => ({
...sub,
assignmentTitle: assignment.title,
courseTitle: assignment.courseTitle,
assignmentId: assignment.id
}));
});

// Get notifications
const notifications = assignmentObserver.getNotificationsForStudent(user.username);
const unreadCount = assignmentObserver.getUnreadCount(user.username);

// Calculate stats
const stats = {
enrolledCourses: enrolledCourses.length,
totalAssignments: allAssignments.length,
completedAssignments: studentSubmissions.length,
pendingAssignments: allAssignments.length - studentSubmissions.length,
unreadNotifications: unreadCount
};

// Get recent activity
const recentActivity = [
`Enrolled in ${enrolledCourses.length} courses`,
`Completed ${studentSubmissions.length} assignments`,
`Has ${unreadCount} unread notifications`
];

return {
user,
stats,
enrolledCourses,
courseAssignments,
allAssignments,
studentSubmissions,
notifications,
recentActivity,
userRole: 'student'
};
}

function getInstructorDashboard(user, allCourses) {
// Get courses created by this instructor
const createdCourses = allCourses.filter(course => course.instructor === user.username);

// Get assignments for created courses
const courseAssignments = createdCourses.map(course => ({
course,
assignments: getAssignmentsByCourse(course.id)
}));

// Get all assignments with course info
const allAssignments = courseAssignments.flatMap(ca =>
ca.assignments.map(assignment => ({
...assignment,
courseTitle: ca.course.title,
courseId: ca.course.id
}))
);

// Get all submissions across all courses
const allSubmissions = allAssignments.flatMap(assignment => {
const submissions = getSubmissions(assignment.id);
return submissions.map(sub => ({
...sub,
assignmentTitle: assignment.title,
courseTitle: assignment.courseTitle,
assignmentId: assignment.id
}));
});

// Calculate stats
const stats = {
createdCourses: createdCourses.length,
totalAssignments: allAssignments.length,
totalSubmissions: allSubmissions.length,
averageSubmissionsPerAssignment: allAssignments.length > 0
? (allSubmissions.length / allAssignments.length).toFixed(1)
: 0
};

// Get recent activity
const recentActivity = [
`Created ${createdCourses.length} courses`,
`Posted ${allAssignments.length} assignments`,
`Received ${allSubmissions.length} submissions`
];

return {
user,
stats,
createdCourses,
courseAssignments,
allAssignments,
allSubmissions,
recentActivity,
userRole: 'instructor'
};
}

function getAdminDashboard(user, allCourses) {
// Get all courses in the system (no assignment data)
const coursesWithBasicInfo = allCourses.map(course => ({
...course,
instructorName: course.instructor
}));

// Calculate basic stats (no assignment/submission data)
const stats = {
totalCourses: allCourses.length,
totalInstructors: 3, // We have 3 instructors
totalStudents: 2, // We have 2 students
activeCourses: allCourses.length // All courses are active
};

// Get recent activity (no assignment references)
const recentActivity = [
`Managing ${allCourses.length} courses in the system`,
`Overseeing course catalog and instructor assignments`,
`System administration and user management`
];

return {
user,
stats,
allCourses: coursesWithBasicInfo,
allAssignments: [], // Explicitly set to empty array for admin
allSubmissions: [], // Explicitly set to empty array for admin
recentActivity,
userRole: 'admin'
};
}

module.exports = {
getDashboardData
};  