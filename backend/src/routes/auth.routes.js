import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/google", AuthController.googleLogin);
router.get("/me", requireAuth, AuthController.getMe);
router.post("/logout", AuthController.logout);

export default router;
