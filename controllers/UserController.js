import * as UserService from '../services/UserService';
import { body, validationResult } from 'express-validator';
import { AppError } from '../utils/errorHandler';
import User from '../models/User';
import passport from 'passport';
import '../authentication/passport-config';
import formidable from 'formidable';
import path from 'path';
import { uploadImage, deleteImage } from '../uploadio/uploadio_API';

const getUser = async(req,res,next) => {
    try{
        const username = req.query.username;
        const userInfo = await UserService.getUser(username);
        res.json({ status:"success", data: userInfo });
    } catch(err) {
        next(err);
    }
};

const getUserFriends = async(req,res,next) => {
    try {
        const userId = req.user._id;
        const userFriends = await UserService.getUserFriends(userId);
        
        res.json({ status: "success", data: userFriends });
    } catch(err) {
        next(err);
    }
}

const searchUsers = async(req,res,next) => {
    try {
        const queryValue = req.query.keyword;
        const limit = req.query.limit;
        const page = req.query.page;

        if (!limit || limit > 15 || limit < 1) next(new AppError(400, 'Invalid limit query value. Must be between 1 and 15'));
        if (!page || Number.isInteger(page) || page <= 0) next(new AppError(400, 'Invalid ?page value'));
        if (!queryValue) throw new AppError(400, next('Invalid search query'));
        
        const users = await UserService.searchUsers(queryValue, limit, page);
        
        res.json({ status: "success", data: users});
    } catch(err) {
        next(err);
    }
}

const deleteUser = async(req,res,next) => {
    try{
        const result = await UserService.deleteUser(req.params.UserId);
        res.json({ status:"success", data: null})
    } catch(err) {
        next(err);
    }
}

const createUser = [
    body('username')
        .exists().withMessage('Username field is required')
        .not().matches('/^[a-zA-Z0-9_]{4,15}$/').withMessage('Username has a min of 4 and max of 15 characters. Can only include alphabets, numbers and underscores')
        .custom(async(value, { req } ) => { 
            // Checks if the username is already registered
            const user = await User.findOne({ username: value }).exec(); // Returns null if no user is found
            if (user !== null) {
                throw new Error("Username is already taken");
            } 
        })
        .escape(),
    body('email')
        .exists().withMessage('Email field is required')
        .isEmail().withMessage('Email is invalid')
        .custom(async(value, { req } ) => { 
                // Checks if the email is already registered
                const user = await User.findOne({ email: value }).exec(); // Returns null if no user is found
                if (user !== null) {
                    throw new Error("Email is already registered");
                } 
        })
        .escape(),
    body('password')
        .exists().withMessage('Password field is required')
        .isStrongPassword().withMessage("Password min length is 8. Needs to contain atleast 1 lowercase, uppercase, symbol and number")
        .custom((value, { req } ) => { // Checks if the two passwords are the same
            if (value !== req.body.confirmPassword){
                throw new Error("Password and Confirm Password are not the same");
            }
            return true;
        })
        .escape(),
    body('dob')
        .exists().withMessage('dob is required')
        .isDate().withMessage('Date of birth is required')
        .isAfter('1920-01-01').withMessage('Invalid date of birth')
        .isBefore('2023-01-01').withMessage('Invalid date of birth')
        .escape(),
    async(req,res,next) => {
        try{
            const errors = validationResult(req);
            
            if (!errors.isEmpty()) { // Making the error objects more concise. Instead of have 5 props into an object containing the error path and msg ex. { email: 'Email not valid' }
                const errorsArray = errors.array();
                const errorsObject = {};
              
                errorsArray.forEach((err) => {
                  errorsObject[err.path] = err.msg;
                });
                return next(new AppError(400, errorsObject));
            }

            const { username, email, password, firstName, lastName, dob } = req.body;
            const user = await UserService.createUser({ username, email, password, firstName, lastName, dob});
            res.json({ status: "success", data: user });
        } catch(err) {
            next(err);
        }
    }
];

const updateProfile = async (req, res, next) => {
    const form = formidable({
        uploadDir: path.resolve(__dirname, '..','uploads'),
        keepExtensions: true, 
      });

  form.parse(req, async (err, fields, files) => {
    if (err) {
        console.log(err)
      next(new AppError(500, "Could not update user's profile"))
    }

    try {
        if(files?.profilePicture){
            if (req.user.profilePicture) {
                const filePath = getParentAndDirectParentFile(req.user.profilePicture, 'profile_images'); 
                await deleteImage(filePath);
            }
            const url = await uploadImage(files.profilePicture[0], '/profile_images');
            const result = await UserService.updateProfileImages(url, 'profile', req.user._id);
        }

        if (files?.headerPicture) {
            if (req.user.profilePicture) {
                const filePath = getParentAndDirectParentFile(req.user.profileHeader, 'profile_headers'); 
                await deleteImage(filePath);
            }
            const url = await uploadImage(files.headerPicture[0], '/profile_headers');
            const result = await UserService.updateProfileImages(url, 'header', req.user._id);
        } 

        if(fields?.bio.trim() !== '') {
            const result = await UserService.updateProfileBio(req.user._id, fields.bio[0]);
        }

      return res.status(200).json({ status: "success", data: null });
    } catch (error) {
        console.log(error)
        next(new AppError(500, "Could not update user's profile"))
    }
  });
}; 

const requestFriend = async(req,res,next) => {
    // req.query.userId is the id of the user to send friend request to
    if (!req.query.userId || req.user._id == req.query.userId) {
        next(new AppError(400, "Invalid ?userId query value"));
    }

    UserService.requestFriend(req.user._id, req.query.userId)
        .then(result => {
            res.json({ status: "success", data: null });
        }).catch(err => {
            next(err);
        })
}

const acceptFriend = async (req,res,next) => {
    UserService.acceptFriend(req.user._id, req.query.userId)
        .then(result => {
            res.json({ status: "success", data: null });
        })
        .catch(err => {
            next(err);
        })
}

const rejectFriend = async (req,res,next) => {
    UserService.rejectFriend(req.user._id, req.query.userId)
        .then(result => {
            res.json({ status: "success", data:null });
        })
        .catch(err => {
            next(err)
        })
}

const removeFriend = async(req,res,next) => {
    UserService.removeFriend(req.user._id, req.query.userId)
        .then(result => {
            res.json({ status: "success", data:null });
        })
        .catch(err => {
            next(err)
        })
}


const login = [
    body('email')
      .exists().withMessage('Email field is required')
      .isEmail().withMessage('Email is not valid')
      .escape(),
    body('password')
      .exists().withMessage('Password field is required')
      .escape(),
    (req, res, next) => {
        const errors = validationResult(req);
            
        if (!errors.isEmpty()) { // Making the error objects more concise. Instead of have 5 props into an object containing the error path and msg ex. { email: 'Email not valid' }
            const errorsArray = errors.array();
            const errorsObject = {};
          
            errorsArray.forEach((err) => {
              errorsObject[err.path] = err.msg;
            });
            return next(new AppError(400, errorsObject));
        }
  
        if (req.isAuthenticated()) {
          return next(new AppError(400, {auth: 'User already logged in'}));
        }
  
        passport.authenticate('user-local', (err, user, info) => {
            if (err) {
                console.log(err);
              return next(new AppError(500,  {auth: "Couldn't proccess your request. Try again later."}));
            }
        
            if (!user) {
                console.log(info)
              return next(new AppError(401, {auth: info.message}));
            }
        
            req.login(user, (err) => {
              if (err) {
                return next(new AppError(500, err));
              }
          
              return res.json({ status: "success", data: user });
        });
      })(req, res, () => {
        // Empty callback to prevent further execution of middleware
        return;
      });
    }
  ];
  

const logout = (req,res,next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.json({ status: "success", data:null })
    });
}

const authStatus = async(req,res,next) => {
    if(!req.isAuthenticated() || !req.session || !req.session.passport || !req.session.passport.user) {
        res.json({ status: "success", data: { isAuthenticated: false, user: null }});
    } else {
        res.json({ status: "success", data: { isAuthenticated: true, user: req.user }});
    }
}

function getParentAndDirectParentFile(url, keyword) {
    const keywordIndex = url.indexOf(`/${keyword}/`);
  
    if (keywordIndex !== -1) {
      const directParentFile = url.substring(keywordIndex);
      return directParentFile;
    } else {
      return null;
    }
  }

export { getUser, getUserFriends, createUser, deleteUser, updateProfile, login, logout, requestFriend, acceptFriend, rejectFriend, removeFriend,authStatus, searchUsers };