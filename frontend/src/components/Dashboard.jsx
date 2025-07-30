import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from './Navigation';
import { BACKGROUND_PATTERNS, COMMON_STYLES } from '../constants/styles';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const navigate = useNavigate();

  // Get the checkered pattern style
  const patternStyle = BACKGROUND_PATTERNS.checkered(false); // false for light theme

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    console.log("Dashboard useEffect - userData:", userData);
    console.log("Dashboard useEffect - token:", token);
    
    if (userData && token) {
      setUser(JSON.parse(userData));
      fetchSessions();
    } else {
      console.log("No user data or token found, redirecting to login");
      navigate('/login');
    }
    setIsLoading(false);
  }, [navigate]);

  const fetchSessions = async () => {
    try {
      setIsLoadingSessions(true);
      const token = localStorage.getItem('accessToken');
      console.log("token in dashboard" , token)
      
      if (!token) {
        console.log("No token found, redirecting to login");
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        navigate('/login');
        return;
      }
      
      const response = await axios.get(`${import.meta.env.VITE_API_URL}sessions`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSessions(response.data.data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      if (error.response?.status === 401) {
        console.log("Token expired or invalid, redirecting to login");
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        navigate('/login');
      } else {
        // Show error toast here if we had react-toastify
        console.error('Failed to fetch sessions:', error.message);
      }
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_API_URL}v1/auth/logout`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local storage and redirect
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      navigate('/login');
    }
  };

  const handleCreateNewSession = () => {
    navigate('/editor/new');
  };

  const handleEditSession = (sessionId) => {
    navigate(`/editor/${sessionId}`);
  };

  const handleDeleteSession = async (sessionId, sessionTitle) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${sessionTitle}"? This action cannot be undone.`
    );
    
    if (confirmDelete) {
      try {
        const token = localStorage.getItem('accessToken');
        await axios.delete(`${import.meta.env.VITE_API_URL}sessions/${sessionId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Refresh the sessions list
        fetchSessions();
      } catch (error) {
        console.error('Error deleting session:', error);
        if (error.response?.status === 403) {
          alert("You don't have permission to delete this session.");
        } else {
          alert("Failed to delete session. Please try again.");
        }
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen" style={patternStyle}>
      <Navigation currentPage="dashboard" />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className={COMMON_STYLES.card}>
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.fullName}!</h1>
              <p className="text-gray-600 mt-2">Manage your wellness sessions</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleCreateNewSession}
                className={COMMON_STYLES.primaryButton}
              >
                + Create New Session
              </button>
            </div>
          </div>

          {/* Sessions Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">My Sessions</h2>
              <button
                onClick={fetchSessions}
                disabled={isLoadingSessions}
                className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
              >
                {isLoadingSessions ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            {isLoadingSessions ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading sessions...</p>
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No sessions yet</h3>
                <p className="text-gray-500 mb-6">Create your first wellness session to get started</p>
                <button
                  onClick={handleCreateNewSession}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Your First Session
                </button>
              </div>
            ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {sessions.map((session) => (
    <div
      key={session._id}
      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {session.title}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            session.status === "published"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {session.status}
        </span>
      </div>

      {session.tags && session.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {session.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {session.jsonUrl && (
        <p className="text-sm text-gray-600 mb-4 truncate">
          <span className="font-medium">URL:</span> {session.jsonUrl}
        </p>
      )}

      <div className="text-xs text-gray-500 mb-4">
        Last updated: {formatDate(session.updatedAt)}
      </div>

      <div className="flex gap-2">
        {session.status === "draft" ? (
          <button
            onClick={() => handleEditSession(session._id)}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Edit Session
          </button>
        ) : (
          <button
            onClick={() => navigate(`/view/${session._id}`)} 
            className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            View Session
          </button>
        )}
        <button
          onClick={() => handleDeleteSession(session._id, session.title)}
          className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  ))}
</div>

            )}
          </div>

          {/* User Info Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">User Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {user.fullName}</p>
                <p><span className="font-medium">Email:</span> {user.email}</p>
                <p><span className="font-medium">Username:</span> {user.username}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Account Status</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Status:</span> Active</p>
                <p><span className="font-medium">Member Since:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
                <p><span className="font-medium">Total Sessions:</span> {sessions.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 