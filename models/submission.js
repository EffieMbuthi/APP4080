// In-memory submissions
const submissions = [];
module.exports = {
  getAll: () => submissions,
  add: (submission) => submissions.push(submission),
  getByStudent: (username) => submissions.filter(s => s.student === username)
};