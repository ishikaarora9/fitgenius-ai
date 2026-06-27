import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutAPI, dietAPI } from '../services/api';
import { ArrowLeft, Dumbbell, Apple, Calendar } from 'lucide-react';

const History = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [meals, setMeals] = useState([]);
  const [activeTab, setActiveTab] = useState('workouts');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const [workoutRes, mealRes] = await Promise.all([
        workoutAPI.getHistory(),
        dietAPI.getHistory()
      ]);
      setWorkouts(workoutRes.data.workouts || []);
      setMeals(mealRes.data.meals || []);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Your History</h1>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b">
            <button
              onClick={() => setActiveTab('workouts')}
              className={`flex items-center gap-2 pb-4 px-4 font-semibold transition ${
                activeTab === 'workouts'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Dumbbell size={20} />
              Workouts ({workouts.length})
            </button>
            <button
              onClick={() => setActiveTab('meals')}
              className={`flex items-center gap-2 pb-4 px-4 font-semibold transition ${
                activeTab === 'meals'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Apple size={20} />
              Diet Plans ({meals.length})
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading history...</p>
            </div>
          ) : (
            <>
              {/* Workout History */}
              {activeTab === 'workouts' && (
                <div className="space-y-6">
                  {workouts.length === 0 ? (
                    <div className="text-center py-12">
                      <Dumbbell className="mx-auto text-gray-400 mb-4" size={48} />
                      <p className="text-gray-500">No workout plans yet</p>
                      <button
                        onClick={() => navigate('/workout')}
                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                      >
                        Generate Your First Workout
                      </button>
                    </div>
                  ) : (
                    workouts.slice().reverse().map((workout, index) => (
                      <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">
                              {workout.workoutPlan?.planName || 'Workout Plan'}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                              <Calendar size={16} />
                              {formatDate(workout.date)}
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              workout.completed
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {workout.completed ? 'Completed' : 'Pending'}
                          </span>
                        </div>

                        <div className="space-y-4">
                          {workout.workoutPlan?.workouts?.map((day, i) => (
                            <div key={i} className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-bold text-blue-600 mb-2">
                                {day.day} - {day.focus}
                              </h4>
                              <div className="space-y-2">
                                {day.exercises?.map((exercise, j) => (
                                  <div key={j} className="bg-white border rounded-lg p-3">
                                    <h5 className="font-semibold text-gray-800">{exercise.name}</h5>
                                    <p>Sets: {exercise.sets}</p>
                                    <p>Reps: {exercise.reps}</p>
                                    <p>Rest: {exercise.rest}</p>
                                    <p>Instructions: {exercise.instructions}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Warm-up */}
                        {workout.workoutPlan?.warmup && (
                          <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                            <h4 className="font-bold text-orange-700 mb-2">Warm-up</h4>
                            <p>{workout.workoutPlan.warmup}</p>
                          </div>
                        )}

                        {/* Cool Down */}
                        {workout.workoutPlan?.cooldown && (
                          <div className="mt-4 p-3 bg-green-50 rounded-lg">
                            <h4 className="font-bold text-green-700 mb-2">Cool Down</h4>
                            <p>{workout.workoutPlan.cooldown}</p>
                          </div>
                        )}

                        {/* Tips */}
                        {workout.workoutPlan?.tips?.length > 0 && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <h4 className="font-bold text-blue-700 mb-2">Tips</h4>
                            <ul className="list-disc pl-5">
                              {workout.workoutPlan.tips.map((tip, i) => (
                                <li key={i}>{tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Diet History */}
              {activeTab === 'meals' && (
                <div className="space-y-6">
                  {meals.length === 0 ? (
                    <div className="text-center py-12">
                      <Apple className="mx-auto text-gray-400 mb-4" size={48} />
                      <p className="text-gray-500">No diet plans yet</p>
                      <button
                        onClick={() => navigate('/diet')}
                        className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                      >
                        Generate Your First Diet Plan
                      </button>
                    </div>
                  ) : (
                    meals.slice().reverse().map((meal, index) => (
                      <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">
                              {meal.mealPlan?.planName || 'Diet Plan'}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                              <Calendar size={16} />
                              {formatDate(meal.date)}
                            </div>
                          </div>
                          {meal.mealPlan?.dailyCalories && (
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600">
                                {meal.mealPlan.dailyCalories}
                              </div>
                              <div className="text-sm text-gray-500">kcal/day</div>
                            </div>
                          )}
                        </div>

                        {/* Macros */}
                        {meal.mealPlan?.macros && (
                          <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="bg-green-50 p-3 rounded-lg text-center">
                              <div className="text-lg font-bold text-green-600">
                                {meal.mealPlan.macros.protein}g
                              </div>
                              <div className="text-xs text-gray-600">Protein</div>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg text-center">
                              <div className="text-lg font-bold text-green-600">
                                {meal.mealPlan.macros.carbs}g
                              </div>
                              <div className="text-xs text-gray-600">Carbs</div>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg text-center">
                              <div className="text-lg font-bold text-green-600">
                                {meal.mealPlan.macros.fats}g
                              </div>
                              <div className="text-xs text-gray-600">Fats</div>
                            </div>
                          </div>
                        )}

                        {/* Meals List */}
                        <div className="space-y-3">
                          {meal.mealPlan?.meals?.map((m, i) => (
                            <div key={i} className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-bold text-green-700">{m.mealType}</h4>
                              <p><strong>Name:</strong> {m.name}</p>
                              <p><strong>Calories:</strong> {m.calories} kcal</p>
                              <p><strong>Time:</strong> {m.time}</p>
                              {m.ingredients?.length > 0 && (
                                <>
                                  <p className="font-semibold mt-2">Ingredients</p>
                                  <ul className="list-disc pl-5">
                                    {m.ingredients.map((item, j) => (
                                      <li key={j}>{item}</li>
                                    ))}
                                  </ul>
                                </>
                              )}
                              {m.instructions && (
                                <p className="mt-2">
                                  <strong>Instructions:</strong> {m.instructions}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
