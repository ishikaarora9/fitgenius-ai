const express = require('express');
const router = express.Router();
const {
  generateWorkout,
  getWorkoutHistory,
  completeWorkout
} = require('../controllers/workoutController');
const auth = require('../middleware/auth');

// All routes are protected
router.post('/generate', auth, generateWorkout);
router.get('/history', auth, getWorkoutHistory);
router.put('/complete/:workoutId', auth, completeWorkout);

module.exports = router;