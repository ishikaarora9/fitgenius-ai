const express = require('express');
const router = express.Router();
const {
  generateDiet,
  getMealHistory,
  logMeal
} = require('../controllers/dietController');
const auth = require('../middleware/auth');

// All routes are protected
router.post('/generate', auth, generateDiet);
router.get('/history', auth, getMealHistory);
router.post('/log', auth, logMeal);

module.exports = router;