import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import SessionEditor from './components/SessionEditor';
import ProtectedRoute from './components/ProtectedRoute';
import ViewSession from './components/ViewSessions';
import PublishedSessions from './components/PublishedSessions';

import './App.css';
// console.log("API URL:", import.meta.env.VITE_API_URL);

function App() {
  return (
    
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/editor/:id" 
            element={
              <ProtectedRoute>
                <SessionEditor />
              </ProtectedRoute>
            } 
          />
          <Route path="/view/:id" element={<ViewSession />} />
          <Route path="/" element={<PublishedSessions />} />

          <Route path="/login" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
