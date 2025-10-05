import { Link } from 'react-router-dom';
import { Dumbbell, Apple, TrendingUp, Zap } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="flex justify-center mb-6">
            <Dumbbell size={80} className="text-white" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            FitGenius AI
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Your Personal AI Fitness & Nutrition Coach
          </p>
          
          <p className="text-lg mb-12 text-gray-300 max-w-2xl mx-auto">
            Get personalized workout plans and diet recommendations powered by 
            advanced AI. Track your progress and achieve your fitness goals!
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <Dumbbell className="mx-auto mb-4" size={40} />
              <h3 className="font-bold text-lg mb-2">AI Workouts</h3>
              <p className="text-sm text-gray-200">Custom workout plans based on your goals</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <Apple className="mx-auto mb-4" size={40} />
              <h3 className="font-bold text-lg mb-2">Smart Nutrition</h3>
              <p className="text-sm text-gray-200">Personalized meal plans and tracking</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <TrendingUp className="mx-auto mb-4" size={40} />
              <h3 className="font-bold text-lg mb-2">Track Progress</h3>
              <p className="text-sm text-gray-200">Monitor your fitness journey with analytics</p>
            </div>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/register"
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition flex items-center gap-2"
            >
              <Zap size={20} />
              Get Started Free
            </Link>
            
            <Link
              to="/login"
              className="bg-white/20 backdrop-blur-lg text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/30 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      <footer className="text-center text-white/80 py-6">
        <p>Built with AI • Made for Fitness Enthusiasts</p>
      </footer>
    </div>
  );
};

export default Landing;