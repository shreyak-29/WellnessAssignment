import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Session } from "../models/session.js";

const createSession = asyncHandler(async (req, res) => {
  const { title, tags, jsonUrl, content, status } = req.body;
  console.log(req.body)

  if (!title) {
    throw new ApiError(400, "Title is required");
  }

  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  const session = await Session.create({
    title,
    tags: Array.isArray(tags) ? tags : [],
    jsonUrl,
    content: content,
    status: status || "draft",
    owner: req.user._id,
    lastAutoSavedAt: new Date()
  });

  return res.status(201).json(
    new ApiResponse(201, session, "Session created successfully")
  );
});

const updateSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { title, tags, jsonUrl, content, status } = req.body;

  const session = await Session.findById(sessionId);

  if (!session) {
    throw new ApiError(404, "Session not found");
  }

  // Check if the user owns this session
  if (session.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You don't have permission to update this session");
  }

  const updatedSession = await Session.findByIdAndUpdate(
    sessionId,
    {
      title,
      tags: Array.isArray(tags) ? tags : [],
      jsonUrl,
      content: content,
      status,
      lastAutoSavedAt: new Date()
    },
    { new: true }
  );

  return res.status(200).json(
    new ApiResponse(200, updatedSession, "Session updated successfully")
  );
});

const getSessionById = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await Session.findById(sessionId);

  if (!session) {
    throw new ApiError(404, "Session not found");
  }

  // Check if the user owns this session
  if (session.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You don't have permission to view this session");
  }

  return res.status(200).json(
    new ApiResponse(200, session, "Session retrieved successfully")
  );
});

const getUserSessions = asyncHandler(async (req, res) => {
  const sessions = await Session.find({ owner: req.user._id })
    .sort({ updatedAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, sessions, "Sessions retrieved successfully")
  );
});

const deleteSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await Session.findById(sessionId);

  if (!session) {
    throw new ApiError(404, "Session not found");
  }

  // Check if the user owns this session
  if (session.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You don't have permission to delete this session");
  }

  await Session.findByIdAndDelete(sessionId);

  return res.status(200).json(
    new ApiResponse(200, {}, "Session deleted successfully")
  );
});

export {
  createSession,
  updateSession,
  getSessionById,
  getUserSessions,
  deleteSession
}; 