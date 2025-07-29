import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
	createSession,
	updateSession,
	getSessionById,
	getUserSessions,
	deleteSession,
} from "../controllers/session.controller.js";

const sessionRouter = Router();

// All routes require authentication
sessionRouter.use(verifyJWT);

// Session routes
sessionRouter.route("/").post(createSession).get(getUserSessions);

sessionRouter
	.route("/:sessionId")
	.get(getSessionById)
	.put(updateSession)
	.delete(deleteSession);

export { sessionRouter };
