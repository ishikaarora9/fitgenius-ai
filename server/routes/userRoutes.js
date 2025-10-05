const express = require('express');
const router = express.Router();
const {
  updateProfile,
  getProfile,
  addProgress,
  getProgress,
  getProgressStats
} = require('../controllers/userController');
const auth = require('../middleware/auth');

// All routes are protected
router.put('/profile', auth, updateProfile);
router.get('/profile', auth, getProfile);
router.post('/progress', auth, addProgress);
router.get('/progress', auth, getProgress);
router.get('/progress/stats', auth, getProgressStats);

module.exports = router;