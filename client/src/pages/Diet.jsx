import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dietAPI } from '../services/api';
import { Apple, Loader, ArrowLeft, Sparkles } from 'lucide-react';

const Diet = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dietPlan, setDietPlan] = useState(null);
  const [error, setError] = useState('');

  const [preferences, setPreferences] = useState({
    mealsPerDay: 3,
    calorieTarget: '',
    cuisinePreference: 'any'
  });

  const handleChange = (e) => {
    setPreferences({ ...preferences, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setDietPlan(null);

    try {
      const response = await dietAPI.generate(preferences);
      setDietPlan(response.data.dietPlan);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate diet plan. Make sure your profile is complete!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <Apple className="text-green-600" size={40} />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">AI Diet Generator</h1>
              <p className="text-gray-600">Get a personalized meal plan powered by AI</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Meals Per Day
                </label>
                <select
                  name="mealsPerDay"
                  value={preferences.mealsPerDay}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="3">3 meals</option>
                  <option value="4">4 meals</option>
                  <option value="5">5 meals</option>
                  <option value="6">6 meals</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Daily Calorie Target (optional)
                </label>
                <input
                  type="number"
                  name="calorieTarget"
                  value={preferences.calorieTarget}
                  onChange={handleChange}
                  placeholder="Auto-calculated"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Cuisine Preference
                </label>
                <select
                  name="cuisinePreference"
                  value={preferences.cuisinePreference}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="any">Any</option>
                  <option value="Indian">Indian</option>
                  <option value="Mediterranean">Mediterranean</option>
                  <option value="Asian">Asian</option>
                  <option value="American">American</option>
                  <option value="Mexican">Mexican</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-4 rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Generating Your Diet Plan...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate Diet Plan
                </>
              )}
            </button>
          </form>
        </div>

        {/* Display Diet Plan */}
        {dietPlan && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{dietPlan.planName}</h2>
            <p className="text-gray-600 mb-4">Daily Calories: {dietPlan.dailyCalories} kcal</p>
            
            {dietPlan.macros && (
              <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-green-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{dietPlan.macros.protein}g</div>
                  <div className="text-sm text-gray-600">Protein</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{dietPlan.macros.carbs}g</div>
                  <div className="text-sm text-gray-600">Carbs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{dietPlan.macros.fats}g</div>
                  <div className="text-sm text-gray-600">Fats</div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {dietPlan.meals?.map((meal, index) => (
                <div key={index} className="border-b pb-6 last:border-b-0">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-green-600">{meal.mealType}</h3>
                      <p className="text-gray-600">{meal.time}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-800">{meal.calories} kcal</div>
                    </div>
                  </div>
                  
                  <h4 className="font-bold text-gray-800 mb-2">{meal.name}</h4>
                  
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Ingredients:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {meal.ingredients?.map((ingredient, i) => (
                        <li key={i}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>

                  {meal.instructions && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Instructions:</p>
                      <p className="text-sm text-gray-600">{meal.instructions}</p>
                    </div>
                  )}

                  {meal.macros && (
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>P: {meal.macros.protein}g</span>
                      <span>C: {meal.macros.carbs}g</span>
                      <span>F: {meal.macros.fats}g</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {dietPlan.tips && (
              <div className="mt-6 bg-green-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">💡 Nutrition Tips:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {dietPlan.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {dietPlan.hydration && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-700">💧 <strong>Hydration:</strong> {dietPlan.hydration}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Diet;