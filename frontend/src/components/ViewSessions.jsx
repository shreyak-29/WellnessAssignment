import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navigation from "./Navigation";

const ViewSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setIsLoading(true);
        // No Authorization header needed
        const response = await axios.get(`http://localhost:3000/api/sessions/${id}`);
        setSession(response.data.data);
      } catch (err) {
        console.error("Error fetching session:", err);
        if (err.response?.status === 401) {
          setError("This session is private or requires login.");
        } else if (err.response?.status === 404) {
          setError("Session not found.");
        } else {
          setError("Failed to load session.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Back
        </button>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <p className="text-gray-600">Session not found.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <Navigation currentPage="view" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{session.title}</h1>
          {session.tags && session.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {session.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
            {session.content}
          </div>
          <div className="mt-6">
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSession;
