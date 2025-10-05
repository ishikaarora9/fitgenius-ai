import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Dumbbell, Apple, TrendingUp, Calendar } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Dumbbell className="text-purple-600" size={32} />
            <h1 className="text-2xl font-bold text-gray-800">FitGenius AI</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-gray-700">👋 Hi, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h2>
          <p className="text-gray-600">Track your fitness journey and achieve your goals</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <button
            onClick={() => navigate('/profile')}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition text-left"
          >
            <User className="text-purple-600 mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">Setup Profile</h3>
            <p className="text-gray-600">Complete your fitness profile</p>
          </button>

          <button
            onClick={() => navigate('/workout')}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition text-left"
          >
            <Dumbbell className="text-blue-600 mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">Generate Workout</h3>
            <p className="text-gray-600">Get AI-powered workout plans</p>
          </button>

          <button
            onClick={() => navigate('/diet')}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition text-left"
          >
            <Apple className="text-green-600 mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">Generate Diet Plan</h3>
            <p className="text-gray-600">Get personalized meal plans</p>
          </button>

          <button
            onClick={() => navigate('/history')}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition text-left"
          >
            <Calendar className="text-orange-600 mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">View History</h3>
            <p className="text-gray-600">See past workouts and diet plans</p>
          </button>
        </div>

        {/* Progress Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="text-purple-600" size={32} />
            <h3 className="text-2xl font-bold">Your Progress</h3>
          </div>
          
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No progress data yet</p>
            <button
              onClick={() => navigate('/progress')}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700 transition"
            >
              Add Your First Progress Entry
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;