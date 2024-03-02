import {
  createUser,
  login,
  getLoginPage,
  logout,
} from "@src/controller/userController";
import { Router } from "express";
const userRoute = Router();

userRoute.get("/login", getLoginPage);
userRoute.post("/login", login);
userRoute.get("/logout", logout)

userRoute.post("/signup", createUser);

export default userRoute;
