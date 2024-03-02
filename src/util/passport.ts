import { Strategy as LocalStrategy } from "passport-local";
import User from "@src/models/userModel";
import bcrypt from "bcrypt";

export const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
  },
  async (username, password, done) => {
    try {
      const user = await User.findOne({ email: username });
      if (!user) {
        return done(null, false, { message: "Email not found" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Password doesn't match" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  },
);
