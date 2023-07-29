import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import passport from 'passport';

import User from '../models/User';
import Admin from '../models/Admin';


const configurePassport = () => {
  // Configure local strategy for User
  passport.use('user-local', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
  }, async (username, password, done) => {
      try {
          console.log(username);
          const user = await User.findOne({ email: username }).exec();
          console.log(user);
          if (!user) {
              return done(null, false, { message: 'Invalid email or password' });
          }

          return bcrypt.compare(password, user.password)
            .then((res) => {
              if (res) {
                const { _id, username, email, friends, pendingFriends, pendingRequests, profilePicture } = user;
                return done(null, { _id, username, email,friends, pendingFriends, pendingRequests, profilePicture });
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
  // passport.use('admin-local', new LocalStrategy({
  //     usernameField: 'email',
  //     passwordField: 'password'
  // }, async (username, password, done) => {
  //     try {
  //         const admin = await Admin.findOne({ username });
          
  //         if (!admin) {
  //             return done(null, false, { message: 'Invalid email or password' });
  //         }
          
  //         return bcrypt.compare(password, user.password)
  //           .then((res) => {
  //             if (res) {
  //               // passwords match! log user in
  //               return done(null, user) // Change the user to display only a certain fields, like the User
  //             } else {
  //               // passwords do not match!
  //               return done(null, false, { message: "Incorrect password" })
  //             }
  //           }).catch((error) => {
  //             return done(error);
  //           })
  //     } catch (error) {
  //         return done(error);
  //     }
  // }));

  passport.serializeUser((user, done) => {
    console.log(user)
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
        const userObj = await User.findById(id);
        const user =  {_id: userObj._id, username: userObj.username, userPicture: userObj.profilePicture, email: userObj.email, friends: userObj.friends, pendingFriends: userObj.pendingFriends, pendingRequests: userObj.pendingRequests};
        if (user) {
            return done(null, user);
        }

        // const admin = await Admin.findById(id);
        // if (admin) {
        //     return done(null, admin);
        // }

        return done(new Error('User not found'));
    } catch (error) {
        return done(error);
    }
  });

  return passport;
}

export default configurePassport