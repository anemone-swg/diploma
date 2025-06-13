import { Router } from "express";
import { AuthAndRegController } from "../controllers/authAndReg.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", AuthAndRegController.registration);

router.post("/login", AuthAndRegController.login);

router.get("/check-auth", AuthAndRegController.checkAuth);

router.post("/logout", isAuthenticated, AuthAndRegController.logout);

export default router;
