import {
  createUser,
  login,
  getLoginPage,
  logout,
  getSignUpPage,
} from "@src/controller/userController";
import { Router } from "express";
const userRoute = Router();

userRoute.get("/login", getLoginPage);
userRoute.post("/login", login);
userRoute.get("/logout", logout);

userRoute.get("/signup", getSignUpPage);
userRoute.post("/signup", createUser);

export default userRoute;
