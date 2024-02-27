import User from '@src/models/userModel';
import { Router } from 'express';
import { body, validationResult, matchedData } from 'express-validator';
import { UserBody } from '@src/types';
import bcrypt from 'bcrypt';
const userRoute = Router();

userRoute.post(
  '/signup',
  body('fullname')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({
      min: 2,
      max: 100,
    })
    .withMessage(
      'Full Name must be at least 2 characters and at most 100 characters'
    ),
  body('email')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email is not is not the correct form example: dan@gmail.com')
    .custom(async (value: string) => {
      const user = await User.findOne({ email: value });
      if (user)
        throw new Error('A user has already been created with that email');
    }),
  body('password')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 2 })
    .withMessage('Password must at least be 2 characters'),
  body('passwordConfirmation')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Password confirmation is required')
    .custom((value, { req }) => {
      const { password } = req.body as UserBody;
      return value === password;
    })
    .withMessage('Password do not match'),
  body('adminKey').trim().escape(),
  function (req, res, next) {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        res.render('index', {
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
            const { fullname, email } = await newUser.save();
            const user = { fullname, email };
            res.redirect('/messages');
          }
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default userRoute;
