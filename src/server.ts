/**
 * Setup express server.
 */
import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import session from "express-session";
import MongoStore from "connect-mongo";
import helmet from "helmet";
import logger from "jet-logger";
import morgan from "morgan";
import passport from "passport";
import path from "path";

import EnvVars from "@src/constants/EnvVars";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";

import { NodeEnvs } from "@src/constants/misc";
import { RouteError } from "@src/other/classes";
import User from "./models/userModel";
import messageRoute from "./routes/messageRoute";
import userRoute from "./routes/userRoute";
import { localStrategy } from "./util/passport";
import { connectToDatabase } from "./util/mongo";
// **** Variables **** //

const app = express();

// **** Setup **** //
connectToDatabase(EnvVars.MongodbUri);
// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(EnvVars.CookieProps.Secret));

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.Dev.valueOf()) {
  app.use(morgan("dev"));
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf()) {
  app.use(helmet());
}
// Add error handler
app.use(
  (
    err: Error,
    _: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
  ) => {
    if (EnvVars.NodeEnv !== NodeEnvs.Test.valueOf()) {
      logger.err(err, true);
    }
    let status = HttpStatusCodes.BAD_REQUEST;
    if (err instanceof RouteError) {
      status = err.status;
    }
    return res.status(status).json({ error: err.message });
  },
);

// ** Front-End Content ** //

// Set views directory (html)
const viewsDir = path.join(__dirname, "views");
app.set("views", viewsDir);
app.set("view engine", "ejs");
// Set static directory (js and css).
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));

app.use(
  session({
    secret: "cats",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: EnvVars.MongodbUri }),
  }),
);
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

passport.use(localStrategy);

passport.serializeUser((user: unknown, done) => {
  if (typeof user === "object" && user && "id" in user) done(null, user.id);
  else done(new Error("User type not correct"));
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id, { password: 0 });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.get("/", (_: Request, res: Response) => {
  return res.render("index");
});

app.use("/", userRoute);
app.use("/messages", messageRoute);

export default app;
