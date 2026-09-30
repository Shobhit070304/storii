import { Router } from "express";
import { ExperienceController } from "../controllers/experience.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.delete("/:id", requireAuth, ExperienceController.deleteExperience);

export default router;
