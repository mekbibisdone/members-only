import { getHomePage } from "@src/controller/indexController";
import { Router } from "express";
const indexRoute = Router();

indexRoute.get("/", getHomePage);

export default indexRoute;
