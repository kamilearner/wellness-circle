import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Screenings from './pages/Screenings';
import Symptoms from './pages/Symptoms';
import SupportGroups from './pages/SupportGroups';
import SupportGroupDetail from './pages/SupportGroupDetail';
import PeriodTracker from './pages/PeriodTracker';
import { useAuth } from './context/AuthContext';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  const { token } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={
            token ? <Navigate to="/" /> : <Login />
          } />
          <Route path="/register" element={
            token ? <Navigate to="/" /> : <Register />
          } />

          {/* Protected routes */}
          <Route path="/" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />
          <Route path="/screenings" element={
            <PrivateRoute>
              <Screenings />
            </PrivateRoute>
          } />
          <Route path="/symptoms" element={
            <PrivateRoute>
              <Symptoms />
            </PrivateRoute>
          } />
          <Route path="/support-groups" element={
            <PrivateRoute>
              <SupportGroups />
            </PrivateRoute>
          } />
          <Route path="/support-groups/:groupId" element={
            <PrivateRoute>
              <SupportGroupDetail />
            </PrivateRoute>
          } />
          <Route path="/period-tracker" element={
            <PrivateRoute>
              <PeriodTracker />
            </PrivateRoute>
          } />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;