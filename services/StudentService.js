import bcrypt from 'bcryptjs';
import Student from '../models/Student';
import uploadImage from '../utils/uploadManager';
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

const updateProfilePicture = async(id,imageData) => {
    uploadImage(id,imageData)
        .then((fileUrl)=>{
            Student.findByIdAndUpdate(id, { profilePicture: fileUrl })
        })
        .catch((err) => {
            throw new AppError(500, "Couldn't save image")
        })
};


// 

export { createStudent, getStudent, updateProfilePicture };

// Test StudentService.js *****