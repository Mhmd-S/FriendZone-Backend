import bcrypt from 'bcryptjs';
import Student from '../models/Student';
import Academic from '../models/Academic';
import { AppError } from '../utils/errorHandler';

const getStudent = async(studentId) => {
    const user = await Student.findById(studentId).exec();
    if (user === null) {
        throw new AppError(404, "User not found");
    }
    return user;
}

const createStudent = async(studentObj) => {
    bcrypt.hash(studentObj.password, 10, (err, hash) => {
        if (err) {
            throw new AppError(500, "User couldn't be created");
        }

        studentObj.password = hash;

        const student = new Student({ ...studentObj });

        student.save()
            .then((result) => {
                return result;
            })
            .catch((err)=> {
                console.log(err);
                throw new AppError(500, "User couldn't be created");
            });
    } );
}

const addAcademicRecord = async(studentId, academicObj) => {
    const academicRecord  = new Academic({...academicObj});
    const result = await Student.findByIdAndUpdate({ _id: studentId},
                                                    { $push: { academicRecord } }).exec();
    if (result === null) {
        throw new AppError(404, "User not found");
    }else {
         return result;
    }
}

const updateAcademicRecord = async(studentId, academicId, academicObj) => {
    const academicRecord  = new Academic({...academicObj});
    const result = await Student.findByIdAndUpdate({ _id: studentId, "academicRecord._id": academicId},
                                                    { $set: { "academicRecord.$": academicRecord } }).exec();   
    if (result === null) {
        throw new AppError(404, "User not found");
    }else {
        return result;
        }
}

const updatePersonalStatement = async(studentId, personalStatement) => {
    const result = await Student.findByIdAndUpdate({ _id: studentId},
                                                    { personalStatement: personalStatement }).exec();
    if (result === null) {
        throw new AppError(404, "User not found");
    }else {
         return result;
    }
}

export { createStudent, getStudent, addAcademicRecord, updateAcademicRecord, updatePersonalStatement };

// Test StudentService.js *****