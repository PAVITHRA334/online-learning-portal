const express = require('express');
const { auth, authorizeRole } = require('../middleware/auth');
const router = express.Router();

router.get('/admin', auth, authorizeRole(['admin']), (req, res) => {
  res.json({ message: '✅ Welcome Admin!' });
});

router.get('/instructor', auth, authorizeRole(['instructor']), (req, res) => {
  res.json({ message: '✅ Welcome Instructor!' });
});
router.get('/student', auth, authorizeRole(['student']), (req, res) => {
  res.json({ message: '✅ Welcome Student!' });
});

module.exports = router;
