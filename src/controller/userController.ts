import User from "@src/models/userModel";
import { body, validationResult, matchedData } from "express-validator";
import { LoginBody, UserBody } from "@src/types";
import bcrypt from "bcrypt";
import { NextFunction, Response, Request } from "express";
import passport from "passport";

export const createUser = [
  body("fullname")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({
      min: 2,
      max: 100,
    })
    .withMessage(
      "Full Name must be at least 2 characters and at most 100 characters"
    ),
  body("email")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage(
      "Email is not is not in the correct form. example: dan@gmail.com"
    )
    .custom(async (value: string) => {
      const user = await User.findOne({ email: value });
      if (user)
        throw new Error("A user has already been created with that email");
    }),
  body("password")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Password is required"),
  body("passwordConfirmation")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom((value, { req }) => {
      const { password } = req.body as UserBody;
      return value === password;
    })
    .withMessage("Password do not match"),
  body("adminKey").trim().escape(),
  function (req: Request, res: Response, next: NextFunction) {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        res.render("index", {
          errors: result.array(),
          data: req.body as UserBody,
        });
      } else {
        const data = matchedData(req) as UserBody;
        const newUser = new User({
          fullname: data.fullname,
          email: data.email,
        });
        bcrypt.hash(data.password, 10, async (err, hash) => {
          if (err) {
            next(err);
          } else {
            newUser.password = hash;
            await newUser.save();
            res.redirect("/login");
          }
        });
      }
    } catch (error) {
      next(error);
    }
  },
];

export const getLoginPage = (req:Request, res:Response) => {
  if ("messages" in req.session) {
    const errors = req.session.messages;
    delete req.session.messages;
    res.render("login", { errors });
  } else res.render("login");
};

export const login = [
  body("email")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage(
      "Email is not is not in the correct form. example: dan@gmail.com"
    ),
  body("password")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 2 })
    .withMessage("Password must at least be 2 characters"),
  function (req: Request, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.render("login", {
        errors: result
          .array()
          .map((error) => ("msg" in error ? (error.msg as string) : null)),
        data: req.body as LoginBody,
      });
    } else {
      const data = matchedData(req) as LoginBody;
      req.body = data;
      next();
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  passport.authenticate("local", {
    successRedirect: "/messages",
    failureRedirect: "/login",
    successMessage: true,
    failureMessage: true,
  }),
];