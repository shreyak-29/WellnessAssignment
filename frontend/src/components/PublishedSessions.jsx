import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navigation from "./Navigation";

const PublishedSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublishedSessions = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:3000/api/sessions/published");
        setSessions(response.data.data || []);
      } catch (err) {
        console.error("Error fetching published sessions:", err);
        setError("Failed to load published sessions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublishedSessions();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading published sessions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <Navigation currentPage="published" />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Published Sessions</h1>
        {sessions.length === 0 ? (
          <p className="text-gray-600">No published sessions available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <div key={session._id} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                <h2 className="text-lg font-semibold mb-2">{session.title}</h2>
                <p className="text-sm text-gray-500 mb-2">
                  {session.tags?.join(", ")}
                </p>
                <button
                  onClick={() => navigate(`/view/${session._id}`)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  View Session
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublishedSessions;
