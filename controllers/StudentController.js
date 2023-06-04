import * as studentService from '../services/StudentService';
import { body, validationResult, sanitizeBody } from 'express-validator';
import { AppError } from '../utils/errorHandler';
import Student from '../models/Student';
import passport from 'passport';
import '../authentication/passport-config';
import { validateSPM } from '../utils/resultValidation';

const createStudent = [
    body('email')
        .isEmail().withMessage('Email is not valid')
        .custom(async(value, { req } ) => { 
                // Checks if the email is already registered
                const user = await Student.findOne({ email: value }).exec(); // Returns null if no user is found
                if (user !== null) {
                    throw new Error("Email is already registered");
                }
            return value;  
        })
        .escape(),
    body('password')
        .isStrongPassword().withMessage("Password min length is 8. Needs to contain atleast 1 lowercase, uppercase, symbol and number")
        .custom((value, { req } ) => { // Checks if the two passwords are the same
            if (value !== req.body.confirmPassword){
                throw new Error("Passwords are not the same");
            }
            return value;
        })
        .escape(),
    body('firstName')
        .isLength({ min: 1 }).withMessage('First name is required')
        .escape(),
    body('lastName')
        .isLength({ min: 1 }).withMessage('Last name is required')
        .escape(),
    body('dob')
        .isDate().withMessage('Date of birth is required')
        .escape(),
    body('phoneNumber')
        .isMobilePhone('ms-MY').withMessage('Malaysian phone number is required')
        .escape(),
    async(req,res,next) => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) return next(new AppError(400, errors.array()));

            const { email, password, firstName, lastName, dob, phoneNumber } = req.body;
            const user = await studentService.createStudent({ email, password, firstName, lastName, dob, phoneNumber });
            res.json({ status: "OK", result: user });
        } catch(err) {
            next(err);
        }
    }
];

const login = (req, res, next)  => {
    passport.authenticate('student-local', (err,user,info) => {
        if (err) return next(new AppError(500, err));
        if (!user) return next(new AppError(400, info.message));
        req.login(user, (err) => {
            if(err) return(new AppError(500, err));
            res.json({ status: "OK", result: user }) 
            return;
        })
    })(req,res,next);
}

const updateAcademic = [ // TODO: Add validation for other academics
    body('academicName')
        .isIn(['SPM', 'STPM', 'O-Levels' ,'A-Levels', 'IB', 'Foundation', 'Diploma', 'Degree', 'Masters', 'PhD']).withMessage('Academic name is not valid')
        .escape(),
    body('results')
        .isJSON().withMessage('Results is not valid')
        .if(body('academics').equals('SPM'))
        .custom((value, { req } ) => validateSPM(value))
    ,
    async(req, res, next) => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) return next(new AppError(400, errors.array()));

            // const { academicName, results } = req.body;
            // const user = await studentService.addAcademicRecord(req.user._id, { academicName, results });
            res.json({ status: "OK", result: "user" });
        } catch(err) {
            next(err);
        }
    }
]

export { createStudent, login, updateAcademic };