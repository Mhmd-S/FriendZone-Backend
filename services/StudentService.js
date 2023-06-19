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

const deleteStudent = async(studentId) => {
    try{
        const result = await Student.findByIdAndDelete(studentId).exec();
        if (!result){
            throw new Error();
        }
    } catch(err) {
        throw new AppError(400, "Couldn't delete student. Student not found.")
    }
}

const updateProfilePicture = async(id,imageData) => { // Yet to be tested
    uploadImage(id,imageData)
        .then((fileUrl)=>{
            Student.findByIdAndUpdate(id, { profilePicture: fileUrl })
        })
        .catch((err) => {
            throw new AppError(500, "Couldn't save image")
        })
};

const requestFriend = async(userId, friendId) => { // Check this 
    // userId is the user who is sending the request
    try{
        const isFriendsOrRequest = await checkIfFriendsOrRequests(userId, friendId);
        console.log(123)
        if (isFriendsOrRequest) {
            console.log("Shit")
            return;
        }
        const result = await Student.findByIdAndUpdate(friendId, { $push: { pendingFriends: new mongoose.Types.ObjectId(userId) }}).exec();
        return result;
    } catch(err) {
        console.log(err);
        throw new AppError(400, "Couldn't send friend request. A friend request is already present or students are already friends.");
    }
}   

// Checks if both user's are friend or a request between them is established
const checkIfFriendsOrRequests = async(userId, friendId) => {
    try {
        const userFriends = await Student.findById(userId, 'friends pendingFriends pendingRequests')
          .lean()
          .populate('friends', '_id')
          .populate('pendingRequests', '_id')
          .populate('pendingFriends', '_id')
          .exec();
    
        const friends = userFriends.friends.map(friend => friend._id.toString());
        console.log(friends);
        const pendingRequests = userFriends.pendingRequests.map(request => request._id.toString());
        const pendingFriends = userFriends.pendingFriends.map(friend => friend._id.toString());
    
        if (friends.includes(friendId.toString()) || pendingRequests.includes(friendId.toString()) || pendingFriends.includes(friendId.toString())) {
          return true;
        }
    
        return false;
      } catch (err) {
        throw new AppError(500, "Couldn't check friend's list");
      }
}

const acceptFriend = async(userId, friendId) => {
    // userId is the user who is going to accept the request
    try {
        // Delete the pending friend request from the user
        const removeFromPending = await Student.findByIdAndUpdate(userId, {$pull: { pendingFriends: new mongoose.Types.ObjectId(friendId) }}).exec();
         
        // Throw error if couldn't delete the friend who made request from the pending list of the user
        if(!removeFromPending){
            return new AppError(400, "Couldn't accept friend request")
        }

        // Remove the request from the friend who made the request to the user
        const removeFromRequests = await Student.findByIdAndUpdate(friendId, {$pull: { pendingRequests: new mongoose.Types.ObjectId(userId) }}).exec();
        
        // When user accepts a friend request, update his friend list and also the user who made the friend request.
        const addToFriendListToUser = await Student.findByIdAndUpdate(userId, {$push: { friends: new mongoose.Types.ObjectId(friendId) }}).exec();
        const addToFriendListToFriend = await Student.findByIdAndUpdate(friendId, {$push: { friends: new mongoose.Types.ObjectId(userId) }}).exec();

        return {addToFriendListToUser, addToFriendListToFriend};
    } catch(err) {
        throw new AppError(500, "Couldn't accept friend request")
    }
}

const rejectFriend = async(userId, friendId) => { // Continue this
        // userId is the user who is going to reject the request
    try {
        const removeFromPending = await Student.findByIdAndUpdate(userId, {$pull: { pendingFriends: new mongoose.Types.ObjectId(friendId) }}).exec(); 

        // Throw error if couldn't delete the friend who made request from the pending list of the user
        if(!removeFromPending){
            return new AppError(400, "Couldn't accept friend request")
        }
        
        return {addToFriendListToUser, addToFriendListToFriend};
    } catch(err) {
        throw new AppError(500, "Couldn't accept friend request")
    }
}
 

export { createStudent, getStudent, deleteStudent, updateProfilePicture, requestFriend, acceptFriend };

// Test StudentService.js *****