import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/me/contributions", requireAuth, UserController.getMyContributions);

export default router;
