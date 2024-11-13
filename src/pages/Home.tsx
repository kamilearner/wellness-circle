import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Stethoscope, MessageCircle, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Footer } from '../components/Footer';

export default function Home() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const features = [
    {
      icon: <Stethoscope className="w-8 h-8 text-purple-600" />,
      title: 'Recommended Screenings',
      description: 'Get personalized health screening recommendations based on your age and location.',
      path: '/screenings'
    },
    {
      icon: <Heart className="w-8 h-8 text-purple-600" />,
      title: 'Symptoms Checker',
      description: 'Check your symptoms and get AI-powered health insights and recommendations.',
      path: '/symptoms'
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-purple-600" />,
      title: 'Support Groups',
      description: 'Connect with others, share experiences, and find support in our community.',
      path: '/support-groups'
    },
    {
      icon: <Calendar className="w-8 h-8 text-purple-600" />,
      title: 'Period Tracker',
      description: 'Track your menstrual cycle and set reminders for health check-ups.',
      path: '/period-tracker'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">WellnessCircle</h1>
            </div>
            <button
              onClick={() => logout()}
              className="text-gray-600 hover:text-purple-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your Health Journey Starts Here
            </h2>
            <p className="text-lg text-gray-600">
              Access personalized health resources and connect with a supportive community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <button
                key={index}
                onClick={() => navigate(feature.path)}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </button>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}