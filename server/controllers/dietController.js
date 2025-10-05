const { getAIResponse } = require('../config/groq');
const User = require('../models/User');

// Generate Diet/Meal Plan with AI
exports.generateDiet = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user || !user.profile) {
      return res.status(400).json({ 
        message: 'Please complete your profile first' 
      });
    }

    const { mealsPerDay, calorieTarget, cuisinePreference } = req.body;

    // Calculate recommended calories if not provided
    let targetCalories = calorieTarget;
    if (!targetCalories && user.profile.weight && user.profile.height && user.profile.age) {
      const bmr = user.profile.gender === 'male' 
        ? 10 * user.profile.weight + 6.25 * user.profile.height - 5 * user.profile.age + 5
        : 10 * user.profile.weight + 6.25 * user.profile.height - 5 * user.profile.age - 161;
      
      const activityMultiplier = {
        sedentary: 1.2,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9
      };
      
      const tdee = bmr * (activityMultiplier[user.profile.activityLevel] || 1.55);
      
      if (user.profile.goal === 'weight_loss') {
        targetCalories = Math.round(tdee - 500);
      } else if (user.profile.goal === 'muscle_gain') {
        targetCalories = Math.round(tdee + 300);
      } else {
        targetCalories = Math.round(tdee);
      }
    }

    const prompt = `You are a professional nutritionist. Create a detailed meal plan based on the following information:

User Profile:
- Goal: ${user.profile.goal}
- Weight: ${user.profile.weight} kg
- Height: ${user.profile.height} cm
- Age: ${user.profile.age}
- Gender: ${user.profile.gender}
- Activity Level: ${user.profile.activityLevel}
- Dietary Restrictions: ${user.profile.dietaryRestrictions?.join(', ') || 'none'}

Meal Plan Preferences:
- Meals per Day: ${mealsPerDay || 3}
- Target Calories: ${targetCalories} kcal/day
- Cuisine Preference: ${cuisinePreference || 'any'}

Create a meal plan in valid JSON format with this exact structure:
{
  "planName": "descriptive name",
  "dailyCalories": ${targetCalories},
  "macros": {
    "protein": "grams",
    "carbs": "grams",
    "fats": "grams"
  },
  "meals": [
    {
      "mealType": "Breakfast/Lunch/Dinner/Snack",
      "time": "suggested time",
      "name": "meal name",
      "calories": number,
      "ingredients": ["ingredient 1", "ingredient 2"],
      "instructions": "brief cooking instructions",
      "macros": {
        "protein": number,
        "carbs": number,
        "fats": number
      }
    }
  ],
  "tips": ["nutrition tip 1", "tip 2"],
  "hydration": "water intake recommendation"
}

Return ONLY the JSON, no additional text.`;

    const aiResponse = await getAIResponse(prompt);
    
    let text = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let dietPlan;
    try {
      dietPlan = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      return res.status(500).json({ 
        message: 'Error parsing AI response',
        rawResponse: text.substring(0, 200)
      });
    }

    user.mealHistory.push({
      date: new Date(),
      mealPlan: dietPlan
    });
    await user.save();

    res.json({
      message: 'Diet plan generated successfully',
      dietPlan,
      calculatedCalories: targetCalories
    });

  } catch (error) {
    console.error('Generate diet error:', error);
    res.status(500).json({ 
      message: 'Error generating diet plan',
      error: error.message 
    });
  }
};

// Get Meal History
exports.getMealHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('mealHistory');
    res.json({ meals: user.mealHistory });
  } catch (error) {
    console.error('Get meal history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Log Daily Meal
exports.logMeal = async (req, res) => {
  try {
    const { mealType, foodItems, calories, notes } = req.body;

    const user = await User.findById(req.user._id);

    const mealLog = {
      date: new Date(),
      mealPlan: {
        mealType,
        foodItems,
        calories,
        notes
      }
    };

    user.mealHistory.push(mealLog);
    await user.save();

    res.status(201).json({
      message: 'Meal logged successfully',
      meal: mealLog
    });
  } catch (error) {
    console.error('Log meal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};