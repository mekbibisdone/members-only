import { Router } from "express";
const messageRoute = Router();

messageRoute.get("/", (req, res) => {
  res.render("messages", { user: req.user });
});
export default messageRoute;
