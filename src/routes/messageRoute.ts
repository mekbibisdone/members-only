import { Router } from "express";
const messageRoute = Router();

messageRoute.get("/", (req, res) => {
  return res.render("index",{user:req.user, title:"Homepage"});
});

export default messageRoute;
