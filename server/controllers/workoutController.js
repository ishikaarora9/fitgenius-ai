const { getAIResponse } = require('../config/groq');
const User = require('../models/User');

// Generate Workout Plan with AI
exports.generateWorkout = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user || !user.profile) {
      return res.status(400).json({ 
        message: 'Please complete your profile first' 
      });
    }

    const { equipment, daysPerWeek, timeAvailable, focusArea } = req.body;

    const prompt = `You are a professional fitness trainer. Create a detailed workout plan based on the following information:

User Profile:
- Goal: ${user.profile.goal}
- Activity Level: ${user.profile.activityLevel}
- Age: ${user.profile.age}
- Gender: ${user.profile.gender}

Workout Preferences:
- Available Equipment: ${equipment || 'bodyweight only'}
- Days per Week: ${daysPerWeek || 3}
- Time per Session: ${timeAvailable || 45} minutes
- Focus Area: ${focusArea || 'full body'}

Create a workout plan in valid JSON format with this exact structure:
{
  "planName": "descriptive name",
  "duration": "number of weeks",
  "workouts": [
    {
      "day": "Day 1",
      "focus": "muscle group",
      "exercises": [
        {
          "name": "exercise name",
          "sets": 3,
          "reps": "10-12",
          "rest": "60 seconds",
          "instructions": "brief form tips"
        }
      ]
    }
  ],
  "tips": ["tip 1", "tip 2"],
  "warmup": "warmup routine",
  "cooldown": "cooldown routine"
}

Return ONLY the JSON, no additional text.`;

    const aiResponse = await getAIResponse(prompt);
    
    // Clean and parse response
    let text = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    let workoutPlan;
    try {
      workoutPlan = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      return res.status(500).json({ 
        message: 'Error parsing AI response',
        rawResponse: text.substring(0, 200)
      });
    }

    // Save to user's workout history
    user.workoutHistory.push({
      date: new Date(),
      workoutPlan,
      completed: false
    });
    await user.save();

    res.json({
      message: 'Workout plan generated successfully',
      workoutPlan
    });

  } catch (error) {
    console.error('Generate workout error:', error);
    res.status(500).json({ 
      message: 'Error generating workout plan',
      error: error.message 
    });
  }
};

// Get Workout History
exports.getWorkoutHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('workoutHistory');
    res.json({ workouts: user.workoutHistory });
  } catch (error) {
    console.error('Get workout history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark Workout as Completed
exports.completeWorkout = async (req, res) => {
  try {
    const { workoutId } = req.params;
    const { duration, notes } = req.body;

    const user = await User.findById(req.user._id);
    const workout = user.workoutHistory.id(workoutId);

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    workout.completed = true;
    workout.duration = duration;
    workout.notes = notes;

    await user.save();

    res.json({
      message: 'Workout marked as completed',
      workout
    });
  } catch (error) {
    console.error('Complete workout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};