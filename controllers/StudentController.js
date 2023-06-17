import * as studentService from '../services/StudentService';
import { body, validationResult } from 'express-validator';
import { AppError } from '../utils/errorHandler';
import Student from '../models/Student';
import passport from 'passport';
import '../authentication/passport-config';
import { validateSPM, validateSTPM, validateIGCSE, validateAS_Level, validateA_Level, validateUEC, validateIB, validateCertificate } from '../utils/resultValidation';

const createStudent = [
    body('email')
        .isEmail().withMessage('Email is not valid')
        .custom(async(value, { req } ) => { 
                // Checks if the email is already registered
                const user = await Student.findOne({ email: value }).exec(); // Returns null if no user is found
                if (user !== null) {
                    throw new Error("Email is already registered");
                } 
        })
        .escape(),
    body('password')
        .isStrongPassword().withMessage("Password min length is 8. Needs to contain atleast 1 lowercase, uppercase, symbol and number")
        .custom((value, { req } ) => { // Checks if the two passwords are the same
            if (value !== req.body.confirmPassword){
                throw new Error("Passwords are not the same");
            }
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

const updateAcademic = [
    body('academicName')
        .isIn(['SPM', 'STPM', 'UEC', 'AS-Level' ,'A-Level', 'IB', 'Foundation', 'Diploma', 'Degree', 'Masters', 'PhD']).withMessage('Academic certificate name is not valid'),
    body('results')
        .isJSON().withMessage('Results is not valid')
        .if(body('academicName').equals('SPM'))
        .custom(value => validateSPM(value))

        .if(body('academicName').equals('STPM'))
        .custom(value => validateSTPM(value))

        .if(body('academicName').equals('UEC'))
        .custom(value => validateUEC(value))

        .if(body('academicName').equals('IGCSE'))
        .custom(value => validateIGCSE(value))

        .if(body('academicName').equals('AS-Level'))
        .custom(value => validateAS_Level(value))

        .if(body('academicName').equals('A-Level'))
        .custom(value => validateA_Level(value))

        .if(body('academicName').equals('IB'))
        .custom(value  => validateIB(value))

        .if(body('academicName').isIn(['Foundation', 'Diploma', 'Degree', 'Masters', 'PhD']))
        .custom(value => validateCertificate(value)),
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

const updatePersonalStatement = [
    body('personalStatement')
    .isAlphanumeric().withMessage('Personal statement must be alphanumeric')
    .isLength({ min: 1500, max: 4000 }).withMessage('Personal statement must be between 2000 and 4000 characters (~300-600 words)')
    .escape(),
    (req,res,next) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) return next(new AppError(400, errors.array()));

    } catch (err) {
        next(err);
    }
}]

// Students prefrences (course, university, budget, academicLevel)
// const addPrefrences = [
//     body('academicLevel')
//     . 
//     ,

//     (req, res, next) => {

// }
// ]

export { createStudent, login, updateAcademic, updatePersonalStatement };