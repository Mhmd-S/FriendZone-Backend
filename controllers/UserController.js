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
        res.json({ status:"OK", result: userInfo });
    } catch(err) {
        next(err);
    }
};

const deleteUser = async(req,res,next) => {
    try{
        const result = await UserService.deleteUser(req.params.UserId);
        res.json({ status:"OK", result: "User deleted successfully"})
    } catch(err) {
        next(err);
    }
}

const createUser = [
    body('email')
        .exists().withMessage('Email field is required')
        .isEmail().withMessage('Email is not valid')
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
        .isLength({ min: 1 }).withMessage('First name is required')
        .escape(),
    body('lastName')
        .exists().withMessage('lastName is required')
        .isLength({ min: 1 }).withMessage('Last name is required')
        .escape(),
    body('dob')
        .exists().withMessage('dob is required')
        .isDate().withMessage('Date of birth is required')
        .escape(),
    body('phoneNumber')
        .exists().withMessage('phoneNumber is required')
        .isMobilePhone('ms-MY').withMessage('Malaysian phone number is required')
        .escape(),
    async(req,res,next) => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) return next(new AppError(400, errors.array()));

            const { email, password, firstName, lastName, dob, phoneNumber } = req.body;
            const user = await UserService.createUser({ email, password, firstName, lastName, dob, phoneNumber });
            res.json({ status: "OK", result: user });
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
                res.json({ status: "OK", result: "Profile picture updated" });
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
            res.json({ status: "OK", result: "Friend request sent"});
        }).catch(err => {
            next(err);
        })
}

const acceptFriend = async (req,res,next) => {
    UserService.acceptFriend(req.query.userId, req.user._id)
        .then(result => {
            res.json({ status: "OK", result: "Friend request accepted"});
        })
        .catch(err => {
            next(err);
        })
}

const login = (req, res, next)  => {

    if (req.isAuthenticated()) {
        return next(new AppError(400, 'auth/user-already-logged-in'));
    }

    passport.authenticate('user-local', (err,user,info) => {
        if (err) { return next(new AppError(500, err)) };

        if (!user) { return next(new AppError(400, info.message)) };

        req.login(user, (err) => {
            if(err) { return next(new AppError(500, err)) };
            return res.json({ status: "OK", result: user });
        })
    })(req,res,next);
}

export { getUser, createUser, deleteUser, updateProfilePicture, login, requestFriend, acceptFriend };