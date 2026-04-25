const express = require('express');
const { sendContact, getStudentContacts, getOwnerContacts } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, sendContact);
router.get('/student', protect, getStudentContacts);
router.get('/owner', protect, getOwnerContacts);

module.exports = router;