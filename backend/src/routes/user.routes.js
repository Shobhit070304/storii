import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { optionalAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/me/contributions", optionalAuth, UserController.getMyContributions);

export default router;
