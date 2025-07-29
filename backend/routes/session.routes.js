import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  createSession,
  updateSession,
  getSessionById,
  getUserSessions,
  deleteSession,
} from "../controllers/session.controller.js";
import { Session } from "../models/session.js";

const sessionRouter = Router();

// Public route: Get all published sessions
sessionRouter.get("/published", async (req, res) => {
  try {
    const sessions = await Session.find({ status: "published" }).sort({ updatedAt: -1 });
    res.json({ data: sessions });
  } catch (err) {
    res.status(500).json({ message: "Error fetching published sessions" });
  }
});

// Public route: Get session by ID (allows public access if published)
sessionRouter.get("/:sessionId", async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // If published, return without requiring authentication
    if (session.status === "published") {
      return res.status(200).json({ data: session });
    }

    // If not published, continue to protected route
    next();
  } catch (err) {
    return res.status(500).json({ message: "Error fetching session" });
  }
});

// All routes below require authentication
sessionRouter.use(verifyJWT);

// Protected session routes
sessionRouter.route("/").post(createSession).get(getUserSessions);

sessionRouter
  .route("/:sessionId")
  .get(getSessionById) // this will run only if session is not published and user is authenticated
  .put(updateSession)
  .delete(deleteSession);

export { sessionRouter };
