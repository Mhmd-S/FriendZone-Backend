import bcrypt from 'bcryptjs';
import User from '../models/User';
import uploadImage from '../utils/uploadManager';
import mongoose from 'mongoose';
import { AppError } from '../utils/errorHandler';

const getUser = async(username) => {
    const user = await User.findOne({ username: username }, 'username friends pendingRequests pendingFriends posts').populate('friends', 'username').populate('pendingRequests', 'username').populate('pendingFriends', 'username').populate('posts').exec();
    if (user === null) {
        throw new AppError(404, {error: "User not found"});
    }
    return user;
}

const getUserFriends = async(userId) => {
    const userFriends = await User.findById(userId, 'friends pendingRequests pendingFriends').populate('friends', 'username').populate('pendingFriends', 'username').populate('pendingRequests', 'username').exec();
    if (userFriends === null) {
        throw new AppError(404, {error: "Usern not found"})
    }
    return userFriends;
}

const searchUsers = async(queryValue, resultLimit) => {
    const re = new RegExp(queryValue, "i");
    const users = await User.find({ username: re }, 'username friends posts').populate('friends').populate('posts').limit(resultLimit).exec();
    return users;
}

const createUser = async(userObj) => {
    bcrypt.hash(userObj.password, 10, (err, hash) => {
        if (err) {
            throw new AppError(500, {error: "User couldn't be created"});
        }

        userObj.password = hash;
  
        const user = new User({ ...userObj });

        user.save()
            .then((result) => {
                return result;
            })
            .catch((err)=> {
                console.log(err);
                throw new AppError(500, {error:"User couldn't be created"});
            });
    } );
}

const deleteUser = async(userId) => {
    const result = await User.findByIdAndDelete(userId).exec();
    if (!result){
        throw new Error();
    }
}

const updateProfilePicture = async(id,imageData) => { // Yet to be tested
    uploadImage(id,imageData)
        .then((fileUrl)=>{
            User.findByIdAndUpdate(id, { profilePicture: fileUrl })
        })
        .catch((err) => {
            throw new AppError(500, {error:"Couldn't save image"})
        })
};

const requestFriend = async(userId, friendId) =>  {// Check this 
    // userId is the user who is sending the request
    const isFriendsOrRequest = await checkIfFriendsOrRequests(userId, friendId);

    if (isFriendsOrRequest) { // If they are friends or if there is already a friend request between them then return
        return;
    }
    
    const result = await User.findByIdAndUpdate(friendId, { $push: { pendingFriends: new mongoose.Types.ObjectId(userId) }}).exec();
    return result;
} 

// Checks if both user's are friend or a request between them is established
// Check the friends
const checkIfFriendsOrRequests = async(userId, friendId) => {
    const userFriends = await User.findById(userId, 'friends pendingFriends pendingRequests')
      .lean()
      .populate('friends', '_id')
      .populate('pendingRequests', '_id')
      .populate('pendingFriends', '_id')
      .exec();
    const friends = userFriends.friends.map(friend => friend._id.toString());
    const pendingRequests = userFriends.pendingRequests.map(request => request._id.toString());
    const pendingFriends = userFriends.pendingFriends.map(friend => friend._id.toString());

    if (friends.includes(friendId.toString()) || pendingRequests.includes(friendId.toString()) || pendingFriends.includes(friendId.toString())) {
      return true;
    }

    return false;
}  

const acceptFriend = async(userId, friendId) => {
    // userId is the user who is going to accept the request
    // Delete the pending friend request from the user
    const removeFromPending = await User.findByIdAndUpdate(userId, {$pull: { pendingFriends: new mongoose.Types.ObjectId(friendId) }}).exec();
     
    // Throw error if couldn't delete the friend who made request from the pending list of the user
    if(!removeFromPending){
        return new AppError(400, {error:"Couldn't accept friend request. Request may not exists."})
    }
    // Remove the request from the friend who made the request to the user
    const removeFromRequests = await User.findByIdAndUpdate(friendId, {$pull: { pendingRequests: new mongoose.Types.ObjectId(userId) }}).exec();
    
    // When user accepts a friend request, update his friend list and also the user who made the friend request.
    const addToFriendListToUser = await User.findByIdAndUpdate(userId, {$push: { friends: new mongoose.Types.ObjectId(friendId) }}).exec();
    const addToFriendListToFriend = await User.findByIdAndUpdate(friendId, {$push: { friends: new mongoose.Types.ObjectId(userId) }}).exec();
    return {addToFriendListToUser, addToFriendListToFriend};
}

const rejectFriend = async(userId, friendId) => { // Continue this
    // userId is the user who is going to reject the request
    // Remove the request from the user rejecting
    const removeFromPendingFriend = await User.findByIdAndUpdate(userId, {$pull: { pendingFriends: new mongoose.Types.ObjectId(friendId) }}).exec(); 
    // Throw if the request does not exist
    if(!removeFromPendingFriend){
        return new AppError(400, {error:"Couldn't reject friend request. Request may not exist."})
    }
    // Remove the request from the user who initiated the request
    const removeFromPendingRequest = await User.findByIdAndUpdate(friendId, {$pull: { pendingRequests: new mongoose.Types.ObjectId(userId) }}).exec();
    
    return {addToFriendListToUser, addToFriendListToFriend};
}

export { createUser, getUser, getUserFriends, deleteUser, updateProfilePicture, requestFriend, acceptFriend, rejectFriend, searchUsers };
