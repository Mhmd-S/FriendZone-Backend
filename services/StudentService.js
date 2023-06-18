import bcrypt from 'bcryptjs';
import Student from '../models/Student';
import uploadImage from '../utils/uploadManager';
import mongoose from 'mongoose';
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

const requestFriend = async(userId, friendId) => {
    try{
        const result = await Student.findByIdAndUpdate(friendId, { $push: { pendingFriends: new mongoose.Types.ObjectId(userId) }}).exec();
        return result;
    } catch(err) {
        throw new AppError(500, "Couldn't send friend request");
    }
}   

const acceptFriend = async(userId, friendId) => {
    try {
        const removeFromPending = await Student.findByIdAndUpdate(userId, {$pull: { pendingFriends: new mongoose.Types.ObjectId(friendId) }}).exec(); // Check if it modified anything... if not send an error to user.
        const addToFriendList = await Student.findByIdAndUpdate(userId, {$push: { friends: new mongoose.Types.ObjectId(friendId) }}).exec();
        return addToFriendList;
    } catch(err) {
        throw new AppError(500, "Couldn't accept friend request")
    }
}

// 

export { createStudent, getStudent, updateProfilePicture, requestFriend, acceptFriend };

// Test StudentService.js *****