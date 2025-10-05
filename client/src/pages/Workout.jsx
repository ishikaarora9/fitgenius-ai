import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutAPI } from '../services/api';
import { Dumbbell, Loader, ArrowLeft, Sparkles } from 'lucide-react';

const Workout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [error, setError] = useState('');

  const [preferences, setPreferences] = useState({
    equipment: 'dumbbells, barbell',
    daysPerWeek: 4,
    timeAvailable: 60,
    focusArea: 'full body'
  });

  const handleChange = (e) => {
    setPreferences({ ...preferences, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setWorkoutPlan(null);

    try {
      const response = await workoutAPI.generate(preferences);
      setWorkoutPlan(response.data.workoutPlan);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate workout plan. Make sure your profile is complete!');
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
            <Dumbbell className="text-blue-600" size={40} />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">AI Workout Generator</h1>
              <p className="text-gray-600">Get a personalized workout plan powered by AI</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Available Equipment
                </label>
                <input
                  type="text"
                  name="equipment"
                  value={preferences.equipment}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="dumbbells, barbell, resistance bands"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Days Per Week
                </label>
                <select
                  name="daysPerWeek"
                  value={preferences.daysPerWeek}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="3">3 days</option>
                  <option value="4">4 days</option>
                  <option value="5">5 days</option>
                  <option value="6">6 days</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Time Available (minutes)
                </label>
                <select
                  name="timeAvailable"
                  value={preferences.timeAvailable}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Focus Area
                </label>
                <select
                  name="focusArea"
                  value={preferences.focusArea}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="full body">Full Body</option>
                  <option value="upper body">Upper Body</option>
                  <option value="lower body">Lower Body</option>
                  <option value="chest and arms">Chest & Arms</option>
                  <option value="back and shoulders">Back & Shoulders</option>
                  <option value="legs and glutes">Legs & Glutes</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Generating Your Workout Plan...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate Workout Plan
                </>
              )}
            </button>
          </form>
        </div>

        {/* Display Workout Plan */}
        {workoutPlan && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{workoutPlan.planName}</h2>
            <p className="text-gray-600 mb-6">Duration: {workoutPlan.duration}</p>

            {workoutPlan.workouts?.map((workout, index) => (
              <div key={index} className="mb-6 pb-6 border-b last:border-b-0">
                <h3 className="text-xl font-bold text-blue-600 mb-3">
                  {workout.day} - {workout.focus}
                </h3>
                <div className="space-y-3">
                  {workout.exercises?.map((exercise, i) => (
                    <div key={i} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-800 mb-2">{exercise.name}</h4>
                      <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 mb-2">
                        <span>Sets: {exercise.sets}</span>
                        <span>Reps: {exercise.reps}</span>
                        <span>Rest: {exercise.rest}</span>
                      </div>
                      <p className="text-sm text-gray-600">{exercise.instructions}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {workoutPlan.tips && (
              <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">💡 Tips:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {workoutPlan.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Workout;