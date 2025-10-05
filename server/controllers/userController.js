const User = require('../models/User');

// Update User Profile
exports.updateProfile = async (req, res) => {
  try {
    const { age, weight, height, gender, goal, activityLevel, dietaryRestrictions } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update profile
    user.profile = {
      age: age || user.profile?.age,
      weight: weight || user.profile?.weight,
      height: height || user.profile?.height,
      gender: gender || user.profile?.gender,
      goal: goal || user.profile?.goal,
      activityLevel: activityLevel || user.profile?.activityLevel,
      dietaryRestrictions: dietaryRestrictions || user.profile?.dietaryRestrictions || []
    };

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      profile: user.profile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get User Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ profile: user.profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add Progress Entry
exports.addProgress = async (req, res) => {
  try {
    const { weight, measurements, notes, photo } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const progressEntry = {
      date: new Date(),
      weight,
      measurements,
      notes,
      photo
    };

    user.progress.push(progressEntry);
    await user.save();

    res.status(201).json({
      message: 'Progress added successfully',
      progress: progressEntry
    });
  } catch (error) {
    console.error('Add progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get All Progress
exports.getProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('progress');
    res.json({ progress: user.progress });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Progress Stats
exports.getProgressStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || !user.progress.length) {
      return res.json({
        stats: {
          totalEntries: 0,
          weightChange: 0,
          startWeight: 0,
          currentWeight: 0
        }
      });
    }

    const sortedProgress = user.progress.sort((a, b) => a.date - b.date);
    const startWeight = sortedProgress[0].weight;
    const currentWeight = sortedProgress[sortedProgress.length - 1].weight;
    const weightChange = currentWeight - startWeight;

    res.json({
      stats: {
        totalEntries: user.progress.length,
        weightChange: weightChange.toFixed(2),
        startWeight,
        currentWeight
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};