import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { Footer } from '../components/Footer';
import { API_BASE_URL } from '../config';

export default function Symptoms() {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!symptoms.trim()) {
      toast.error('Please describe your symptoms');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_BASE_URL}/symptoms/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ symptoms: symptoms.trim() })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.diagnosis) {
        throw new Error('Invalid response format');
      }

      setDiagnosis(data.diagnosis);
      toast.success('Analysis completed successfully');
    } catch (error: any) {
      console.error('Symptoms analysis error:', error);
      toast.error(error.message || 'Failed to analyze symptoms. Please try again.');
      setDiagnosis('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2">
                <Heart className="w-8 h-8 text-purple-600" />
                <h1 className="text-2xl font-bold text-gray-900">Symptoms Checker</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Describe Your Symptoms</h2>
              <div className="text-gray-600">
                <p className="mb-4">Please provide detailed information about your symptoms:</p>
                <div className="space-y-2">
                  <p>• What symptoms are you experiencing?</p>
                  <p>• When did they start?</p>
                  <p>• Are they constant or intermittent?</p>
                  <p>• What makes them better or worse?</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Describe your symptoms here..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Analyzing Symptoms...'
                ) : (
                  <>
                    Analyze Symptoms
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {diagnosis && (
              <div className="mt-8 p-6 bg-purple-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>
                <div className="prose prose-purple">
                  {diagnosis.split('\n').map((line, index) => (
                    <p key={index} className="mb-2">{line}</p>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Disclaimer:</strong> This is an AI-powered analysis and should not replace professional medical advice. If you're experiencing severe symptoms or are concerned about your health, please consult a healthcare provider immediately.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}