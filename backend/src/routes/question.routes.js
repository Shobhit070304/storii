import { Router } from "express";
import { QuestionController } from "../controllers/question.controller.js";
import { ExperienceController } from "../controllers/experience.controller.js";
import { requireAuth, optionalAuth } from "../middleware/auth.middleware.js";

const router = Router();

// Question endpoints
router.get("/", QuestionController.getQuestions);
router.get("/:id", QuestionController.getQuestionById);
router.post("/", optionalAuth, QuestionController.createQuestion);
router.delete("/:id", requireAuth, QuestionController.deleteQuestion);

// Nested experiences endpoints for convenience (/api/questions/:questionId/experiences)
router.get("/:questionId/experiences", ExperienceController.getExperiences);
router.post("/:questionId/experiences", optionalAuth, ExperienceController.createExperience);

export default router;
