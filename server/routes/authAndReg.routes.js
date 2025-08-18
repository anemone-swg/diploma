import { Router } from "express";
import { AuthAndRegController } from "../controllers/authAndReg.controller.js";

const router = Router();

router.post("/register", AuthAndRegController.registration);

router.post("/login", AuthAndRegController.login);

// router.get("/check-auth", AuthAndRegController.checkAuth);

router.post("/logout", AuthAndRegController.logout);

router.get("/activate/:link", AuthAndRegController.activate);

router.get("/refresh", AuthAndRegController.refresh);

export default router;
