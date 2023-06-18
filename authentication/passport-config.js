import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import passport from 'passport';

import Student from '../models/Student';
import Admin from '../models/Admin';


const configurePassport = () => {
  // Configure local strategy for Student
  passport.use('student-local', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
  }, async (username, password, done) => {
      try {
          const student = await Student.findOne({ email: username }).exec();
          
          if (!student) {
              return done(null, false, { message: 'Invalid email or password' });
          }

          return bcrypt.compare(password, student.password)
            .then((res) => {
              if (res) {
                const { _id, email, firstName, lastName } = student;
                return done(null, { _id, email, firstName, lastName });
              } else {
                return done(null, false, { message: "Incorrect password" });
              }
            })
            .catch((error) => {
              return done(error);
            });
      } catch (error) {
          return done(error);
      }
  }));

  // Configure local strategy for Admin
  passport.use('admin-local', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
  }, async (username, password, done) => {
      try {
          const admin = await Admin.findOne({ username });
          
          if (!admin) {
              return done(null, false, { message: 'Invalid email or password' });
          }
          
          return bcrypt.compare(password, user.password)
            .then((res) => {
              if (res) {
                // passwords match! log user in
                return done(null, user) // Change the user to display only a certain fields, like the student
              } else {
                // passwords do not match!
                return done(null, false, { message: "Incorrect password" })
              }
            }).catch((error) => {
              return done(error);
            })
      } catch (error) {
          return done(error);
      }
  }));

  passport.serializeUser((user, done) => {
    console.log(user)
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
        const student = await Student.findById(id);
        if (student) {
            return done(null, student);
        }

        const admin = await Admin.findById(id);
        if (admin) {
            return done(null, admin);
        }

        return done(new Error('User not found'));
    } catch (error) {
        return done(error);
    }
  });

  return passport;
}

export default configurePassport