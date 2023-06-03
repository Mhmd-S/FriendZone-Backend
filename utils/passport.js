import passport from "passport"
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import User from '../model/User';

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  },
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if(!user) {
          return done(null, false, { message: "Incorrect Username" });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if(err) {
          throw err;
        }

        if (res) {
          // passwords match! log user in
          return done(null, user);
        } else {
          // passwords do not match!
          return done(null, false, { message: "Incorrect Password" });
        }

      });
      return done(null,user);
    } catch(err) {
      return done(err);
    }
})
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser( async function(id, done) {
  try {
      const user = await User.findById(id);
      done(null,user);
  } catch(err) {
      done(err);
  };
});    