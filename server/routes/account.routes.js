import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  AccountController,
  upload,
} from "../controllers/account.controller.js";

const router = Router();
router.use("/account", isAuthenticated);

router.get("/account/:id", AccountController.getAccount);

router.post(
  "/account/upload_avatar",
  upload.single("avatar"),
  AccountController.uploadAvatar,
);

router.put("/account/update_info/:id", AccountController.updateInfo);

router.delete("/account/delete/:id", AccountController.deleteAccount);

router.put("/account/change_login", AccountController.changeLogin);

router.get("/account/get_users_for_admin", AccountController.getUsersForAdmin);

router.delete("/account/delete_by_admin", AccountController.deleteUserByAdmin);

export default router;
