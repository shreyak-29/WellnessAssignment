import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navigation from "./Navigation";

const SessionEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewSession = id === "new";

  const [session, setSession] = useState({
    title: "",
    tags: [],
    jsonUrl: "",
    content: "",
    status: "draft",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [error, setError] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const autoSaveTimeoutRef = useRef(null);
  const lastSavedRef = useRef(null);

  useEffect(() => {
    if (!isNewSession) {
      fetchSession();
    }
  }, [id]);

  useEffect(() => {
    console.log("Session or hasUnsavedChanges changed:", { 
      hasUnsavedChanges, 
      title: session.title, 
      content: session.content 
    });
    
    if (hasUnsavedChanges) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      autoSaveTimeoutRef.current = setTimeout(() => {
        console.log("Auto-save timeout triggered");
        autoSave();
      }, 5000);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [session, hasUnsavedChanges]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (hasUnsavedChanges && session.title.trim() && session.content.trim()) {
        autoSave();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [hasUnsavedChanges, session.title, session.content]);

  const fetchSession = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");
      console.log("Token in fetchSession:", token);

      if (!token) {
        alert("No access token found. Please log in again.");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `http://localhost:3000/api/sessions/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const fetchedSession = response.data.data;
      setSession({
        title: fetchedSession.title || "",
        tags: Array.isArray(fetchedSession.tags) ? fetchedSession.tags : [],
        jsonUrl: fetchedSession.jsonUrl || "",
        content: fetchedSession.content || "",
        status: fetchedSession.status || "draft",
      });

        if (fetchedSession.status === "published") {
      alert("This session is published and cannot be edited.");
      navigate("/dashboard"); 
    }

      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error fetching session:", error);
      if (error.response && error.response.status === 401) {
        alert("Session expired. Please log in again.");
        navigate("/login");
      } else {
        setError("Failed to load session");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSession((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const autoSave = async () => {
    console.log("Auto-save triggered:", { 
      hasUnsavedChanges, 
      title: session.title, 
      content: session.content,
      titleTrimmed: session.title.trim(),
      contentTrimmed: session.content.trim()
    });

    if (!hasUnsavedChanges) {
      console.log("No unsaved changes, skipping auto-save");
      return;
    }

    // Don't auto-save if title or content is empty
    if (!session.title.trim() || !session.content.trim()) {
      console.log("Title or content is empty, skipping auto-save");
      return;
    }

    try {
      setIsSaving(true);
      const token = localStorage.getItem("accessToken");
      console.log("Token in autoSave:", token);

      if (!token) {
        alert("No access token found. Please log in again.");
        navigate("/login");
        return;
      }

      const sessionData = {
        ...session,
        tags: session.tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0),
        content: session.content,
      };

      console.log("Sending session data:", sessionData);

      if (isNewSession) {
        await axios.post("http://localhost:3000/api/sessions", sessionData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.put(`http://localhost:3000/api/sessions/${id}`, sessionData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setHasUnsavedChanges(false);
      setLastSaved(new Date());
      lastSavedRef.current = new Date();
      console.log("Auto-save successful");
    } catch (error) {
      console.error("Auto-save error:", error);
      if (error.response && error.response.status === 401) {
        alert("Session expired. Please log in again.");
        navigate("/login");
      } else {
        setError("Auto-save failed");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async (status) => {
    try {
      setIsSaving(true);
      setError("");

      const token = localStorage.getItem("accessToken");
      console.log("Token in handleSave:", token);

      if (!token) {
        alert("No access token found. Please log in again.");
        navigate("/login");
        return;
      }

      const sessionData = {
        ...session,
        status,
        tags: session.tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0),
        content: session.content,
      };

      let response;
      if (isNewSession) {
        response = await axios.post("http://localhost:3000/api/sessions", sessionData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        navigate(`/editor/${response.data.data._id}`);
      } else {
        response = await axios.put(`http://localhost:3000/api/sessions/${id}`, sessionData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setHasUnsavedChanges(false);
      setLastSaved(new Date());
      lastSavedRef.current = new Date();
      setError("");
       if (status === "published") {
      navigate("/dashboard");
    }
    } catch (error) {
      console.error("Save error:", error);
      if (error.response && error.response.status === 401) {
        alert("Session expired. Please log in again.");
        navigate("/login");
      } else {
        setError("Failed to save session");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackToDashboard = () => {
    if (hasUnsavedChanges) {
      if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
        navigate("/dashboard");
      }
    } else {
      navigate("/dashboard");
    }
  };

  const handleDelete = async () => {
    if (!isNewSession) {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this session? This action cannot be undone."
      );
      
      if (confirmDelete) {
        try {
          setIsSaving(true);
          setError("");

          const token = localStorage.getItem("accessToken");
          console.log("Token in handleDelete:", token);

          if (!token) {
            alert("No access token found. Please log in again.");
            navigate("/login");
            return;
          }

          await axios.delete(`http://localhost:3000/api/sessions/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          navigate("/dashboard");
        } catch (error) {
          console.error("Delete error:", error);
          if (error.response && error.response.status === 401) {
            alert("Session expired. Please log in again.");
            navigate("/login");
          } else if (error.response && error.response.status === 403) {
            setError("You don't have permission to delete this session.");
          } else {
            setError("Failed to delete session");
          }
        } finally {
          setIsSaving(false);
        }
      }
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <Navigation currentPage="editor" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isNewSession ? "Create New Session" : "Edit Session"}
              </h1>
              <p className="text-gray-600 mt-2">
                {isNewSession
                  ? "Create a new wellness session"
                  : "Update your session details"}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleBackToDashboard}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* Auto-save indicator */}
          {isSaving && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-blue-800">Auto-saving...</span>
              </div>
            </div>
          )}

          {lastSaved && !isSaving && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <span className="text-green-800">
                ✓ Auto-saved at {lastSaved.toLocaleTimeString()}
              </span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <span className="text-red-800">{error}</span>
            </div>
          )}

          {/* Form */}
          <form className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Session Title *
              </label>
              <input
                type="text"
                id="title"
                value={session.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter session title"
                required
              />
            </div>

            {/* Tags */}
            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tags
              </label>
              <input
                type="text"
                id="tags"
                value={session.tags.join(", ")}
                onChange={(e) =>
                  handleInputChange(
                    "tags",
                    e.target.value.split(",").map((tag) => tag.trim())
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter tags separated by commas (e.g., wellness, meditation, stress)"
              />
            </div>

            {/* JSON URL (optional) */}
            <div>
              <label
                htmlFor="jsonUrl"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                URL (optional)
              </label>
              <input
                type="url"
                id="jsonUrl"
                value={session.jsonUrl}
                onChange={(e) => handleInputChange("jsonUrl", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/session-data.json"
              />
            </div>

            {/* Blog Content */}
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Session Content
              </label>
              <textarea
                id="content"
                value={session.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                rows={12}
                placeholder="Write your blog content here..."
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => handleSave("draft")}
                disabled={
                  isSaving || !session.title.trim() || !session.content.trim()
                }
                className="flex-1 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : "Save as Draft"}
              </button>
              <button
                type="button"
                onClick={() => handleSave("published")}
                disabled={
                  isSaving || !session.title.trim() || !session.content.trim()
                }
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Publishing..." : "Publish Session"}
              </button>
              {!isNewSession && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSaving}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Deleting..." : "Delete Session"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SessionEditor;
