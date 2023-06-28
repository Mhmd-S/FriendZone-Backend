import * as UserService from '../services/UserService';
import { body, validationResult } from 'express-validator';
import { AppError } from '../utils/errorHandler';
import User from '../models/User';
import passport from 'passport';
import '../authentication/passport-config';

const getUser = async(req,res,next) => {
    try{
        const userId = req.query.UserId;
        const userInfo = await UserService.getUser(userId);
        res.json({ status:"success", data: userInfo });
    } catch(err) {
        next(err);
    }
};

const searchUsers = async(req,res,next) => {
    try {
        const queryValue = req.query.keyword;
        if (!queryValue) throw new AppError(400, 'Invalid search query');
        const users = await UserService.searchUsers(queryValue);
        res.json({ status: "success", data: users});
    } catch(err) {
        next(err);
    }
}

const deleteUser = async(req,res,next) => {
    try{
        const result = await UserService.deleteUser(req.params.UserId);
        // Delete user session!!!
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
    body('firstName')
        .exists().withMessage('firstName field is required')
        .isAlpha().withMessage('First name needs to contain alphabets only')
        .isLength({ min: 1, max: 50 }).withMessage('First name is required to have a minimum of 1 character and maximum of 50')
        .escape(),
    body('lastName')
        .exists().withMessage('lastName field is required')
        .isAlpha().withMessage('Last name needs to contain alphabets only')
        .isLength({ min: 1, max: 50 }).withMessage('Last name is required to have a minimum of 1 character and maximum of 50')
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

const updateProfilePicture = [
    // Validate the request
    body('imageField')
        .custom((value, { req }) => {
            if (!req.file || !req.file.imageField) {
              throw new Error('Image file is required.');
            }
            console.log(req.files)
            const imageFile = req.files.imageField;
        
            // Check file size (max 1MB)
            if (imageFile.size > 1024 * 1024) {
              throw new Error('Image file size should be less than 1MB.');
            }
        
            // Check file type
            const allowedMimeTypes = ['image/jpeg', 'image/png'];
            if (!allowedMimeTypes.includes(imageFile.mimetype)) {
              throw new Error('Only JPEG, and PNG are allowed.');
            }
        
            return true; // Validation passed
        }),
    (req,res,next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return next(new AppError(400, errors.array()));
        UserService.updateProfilePicture( req.user._id ,req.files.imageField)
            .then(result => {
                res.json({ status: "success", data: null });
            })
            .catch(err => {
                next(err);
            });
    }
]

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
    UserService.acceptFriend(req.query.userId, req.user._id)
        .then(result => {
            res.json({ status: "success", data: null });
        })
        .catch(err => {
            next(err);
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

export { getUser, createUser, deleteUser, updateProfilePicture, login, logout, requestFriend, acceptFriend, authStatus, searchUsers };