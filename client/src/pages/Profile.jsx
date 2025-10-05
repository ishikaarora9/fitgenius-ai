import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, Save, Loader, ArrowLeft } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: 'male',
    goal: 'general_fitness',
    activityLevel: 'moderate',
    dietaryRestrictions: []
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      if (response.data.profile) {
        setFormData({
          age: response.data.profile.age || '',
          weight: response.data.profile.weight || '',
          height: response.data.profile.height || '',
          gender: response.data.profile.gender || 'male',
          goal: response.data.profile.goal || 'general_fitness',
          activityLevel: response.data.profile.activityLevel || 'moderate',
          dietaryRestrictions: response.data.profile.dietaryRestrictions || []
        });
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRestrictionChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(value)
        ? prev.dietaryRestrictions.filter(item => item !== value)
        : [...prev.dietaryRestrictions, value]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await userAPI.updateProfile(formData);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-4 mb-6">
            <User className="text-purple-600" size={40} />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Profile Setup</h1>
              <p className="text-gray-600">Complete your fitness profile for personalized recommendations</p>
            </div>
          </div>

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              Profile updated successfully! Redirecting...
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="10"
                  max="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="25"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                  min="30"
                  max="300"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="70"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Height (cm) *
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  required
                  min="100"
                  max="250"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="175"
                />
              </div>
            </div>

            {/* Fitness Goals */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Fitness Goal *
              </label>
              <select
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="maintenance">Maintenance</option>
                <option value="general_fitness">General Fitness</option>
              </select>
            </div>

            {/* Activity Level */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Activity Level *
              </label>
              <select
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="sedentary">Sedentary (Little to no exercise)</option>
                <option value="moderate">Moderate (Exercise 3-4 days/week)</option>
                <option value="active">Active (Exercise 5-6 days/week)</option>
                <option value="very_active">Very Active (Exercise daily)</option>
              </select>
            </div>

            {/* Dietary Restrictions */}
            <div>
              <label className="block text-gray-700 font-medium mb-3">
                Dietary Restrictions (Optional)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'halal'].map(restriction => (
                  <label key={restriction} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      value={restriction}
                      checked={formData.dietaryRestrictions.includes(restriction)}
                      onChange={handleRestrictionChange}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-gray-700 capitalize">{restriction}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-4 rounded-lg font-bold hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Profile
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;