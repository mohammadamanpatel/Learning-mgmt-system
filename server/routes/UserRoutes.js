import { Router } from "express";
import {
  getProfileInfo,
  login,
  logout,
  register,
  forget_password_token,
  forget_password,
  changePassword,
  updateUser,
} from "../controllers/UserControllers.js";
import { isLoggedIn } from "../middleWares/userMiddleWare.js";


const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", isLoggedIn, getProfileInfo);
router.post("/forget-password-token", forget_password_token);
router.post("/reset-password", forget_password);
router.post("/change-password", isLoggedIn, changePassword);
router.put("/update/:id", isLoggedIn,updateUser);

export default router;
