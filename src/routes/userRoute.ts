import {
  createUser,
  login,
  getLoginPage,
  logout,
  getSignUpPage,
  joinClub,
} from "@src/controller/userController";
import { Router } from "express";
const userRoute = Router();

userRoute.get("/login", getLoginPage);
userRoute.post("/login", login);
userRoute.get("/logout", logout);

userRoute.get("/signup", getSignUpPage);
userRoute.post("/signup", createUser);

userRoute.post("/join", joinClub);
export default userRoute;
