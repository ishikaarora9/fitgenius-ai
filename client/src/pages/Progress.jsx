import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import { TrendingUp, Plus, Loader, ArrowLeft, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Progress = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [progressData, setProgressData] = useState([]);
  const [stats, setStats] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    weight: '',
    measurements: {
      chest: '',
      waist: '',
      hips: '',
      arms: '',
      legs: ''
    },
    notes: ''
  });

  useEffect(() => {
    fetchProgress();
    fetchStats();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await userAPI.getProgress();
      setProgressData(response.data.progress || []);
    } catch (err) {
      console.error('Failed to fetch progress:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await userAPI.getStats();
      setStats(response.data.stats);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.measurements) {
      setFormData({
        ...formData,
        measurements: { ...formData.measurements, [name]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await userAPI.addProgress(formData);
      setShowAddForm(false);
      setFormData({
        weight: '',
        measurements: { chest: '', waist: '', hips: '', arms: '', legs: '' },
        notes: ''
      });
      fetchProgress();
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add progress');
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const chartData = progressData
    .slice()
    .reverse()
    .map(entry => ({
      date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: entry.weight
    }));

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

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <TrendingUp className="text-purple-600" size={40} />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Progress Tracker</h1>
                <p className="text-gray-600">Monitor your fitness journey</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
            >
              <Plus size={20} />
              Add Progress
            </button>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">Total Entries</div>
                <div className="text-3xl font-bold">{stats.totalEntries}</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">Start Weight</div>
                <div className="text-3xl font-bold">{stats.startWeight} kg</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">Current Weight</div>
                <div className="text-3xl font-bold">{stats.currentWeight} kg</div>
              </div>
              <div className={`bg-gradient-to-br ${stats.weightChange < 0 ? 'from-green-500 to-green-600' : 'from-orange-500 to-orange-600'} text-white p-4 rounded-lg`}>
                <div className="text-sm opacity-90">Weight Change</div>
                <div className="text-3xl font-bold">{stats.weightChange} kg</div>
              </div>
            </div>
          )}

          {/* Add Progress Form */}
          {showAddForm && (
            <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Add New Progress Entry</h3>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Weight (kg) *</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Chest (cm)</label>
                  <input
                    type="number"
                    name="chest"
                    value={formData.measurements.chest}
                    onChange={handleChange}
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Waist (cm)</label>
                  <input
                    type="number"
                    name="waist"
                    value={formData.measurements.waist}
                    onChange={handleChange}
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Hips (cm)</label>
                  <input
                    type="number"
                    name="hips"
                    value={formData.measurements.hips}
                    onChange={handleChange}
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Arms (cm)</label>
                  <input
                    type="number"
                    name="arms"
                    value={formData.measurements.arms}
                    onChange={handleChange}
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Legs (cm)</label>
                  <input
                    type="number"
                    name="legs"
                    value={formData.measurements.legs}
                    onChange={handleChange}
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="How are you feeling? Any observations?"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? <Loader className="animate-spin" size={18} /> : <Plus size={18} />}
                  {loading ? 'Saving...' : 'Save Progress'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Weight Chart */}
          {chartData.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Weight Progress</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="weight" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Progress History */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-800">Progress History</h3>
            {progressData.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="mx-auto mb-4 text-gray-400" size={48} />
                <p>No progress entries yet. Add your first entry to start tracking!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {progressData.slice().reverse().map((entry, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold text-gray-800">
                        {new Date(entry.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="text-lg font-bold text-purple-600">{entry.weight} kg</div>
                    </div>
                    {entry.measurements && (
                      <div className="grid grid-cols-5 gap-2 text-sm text-gray-600 mb-2">
                        {entry.measurements.chest && <div>Chest: {entry.measurements.chest}cm</div>}
                        {entry.measurements.waist && <div>Waist: {entry.measurements.waist}cm</div>}
                        {entry.measurements.hips && <div>Hips: {entry.measurements.hips}cm</div>}
                        {entry.measurements.arms && <div>Arms: {entry.measurements.arms}cm</div>}
                        {entry.measurements.legs && <div>Legs: {entry.measurements.legs}cm</div>}
                      </div>
                    )}
                    {entry.notes && (
                      <p className="text-sm text-gray-600 italic">{entry.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;