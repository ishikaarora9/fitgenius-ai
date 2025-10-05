const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profile: {
    age: Number,
    weight: Number,
    height: Number,
    gender: String,
    goal: {
      type: String,
      enum: ['weight_loss', 'muscle_gain', 'maintenance', 'general_fitness']
    },
    activityLevel: {
      type: String,
      enum: ['sedentary', 'moderate', 'active', 'very_active']
    },
    dietaryRestrictions: [String]
  },
  progress: [{
    date: {
      type: Date,
      default: Date.now
    },
    weight: Number,
    measurements: {
      chest: Number,
      waist: Number,
      hips: Number,
      arms: Number,
      legs: Number
    },
    notes: String,
    photo: String
  }],
  workoutHistory: [{
    date: {
      type: Date,
      default: Date.now
    },
    workoutPlan: Object,
    completed: Boolean,
    duration: Number,
    notes: String
  }],
  mealHistory: [{
    date: {
      type: Date,
      default: Date.now
    },
    mealPlan: Object,
    notes: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);