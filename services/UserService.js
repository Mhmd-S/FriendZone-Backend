import bcrypt from 'bcryptjs';
import User from '../models/User';
import mongoose from 'mongoose';
import { AppError } from '../utils/errorHandler';
import fs from 'fs';

export const getUser = async(username) => {
    const user = await User
    .findOne({ username: username }, 'username friends pendingRequests pendingFriends posts profilePicture profileHeader bio')
    .populate('friends', 'username')
    .populate('pendingRequests', 'username')
    .populate('pendingFriends', 'username profilePicture')
    .populate({
        path: 'posts',
        populate: {
            path: 'author',
            select: 'username profilePicture'
        },
        options: {
            sort: { createdAt: -1 } 
        }
    })
    .exec();

   if (user === null) {
       throw new AppError(404, {error: "User not found"});
   }
   return user;
}
 
export const getUserFriends = async(userId) => {
   const userFriends = await User
                           .findById(userId, 'friends pendingRequests pendingFriends')
                           .populate('friends', 'username')
                           .populate('pendingFriends', 'username')
                           .populate('pendingRequests', 'username')
                           .exec();
   if (userFriends === null) {
       throw new AppError(404, {error: "Usern not found"})
   }
   return userFriends;
}
 
export const searchUsers = async (queryValue, limit, page) => {
    const re = new RegExp(queryValue, "i");
  
    const users = await User.aggregate([
      { $match: { username: re } },
      {
        $project: {
          username: 1,
          profilePicture: 1,
          friendsCount: { $size: "$friends" },
          postsCount: { $size: "$posts" },
        },
      },
      { $sort: { friendsCount: -1, postsCount: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit*1 },
    ]);
    
    const usersArray = Array.isArray(users) ? users : [users];

    return usersArray;
  };
  

export const createUser = async(userObj) => {
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
               throw new AppError(500, {error:"User couldn't be created"});
           });
   } );
}
 
export const deleteUser = async(userId) => {
   const result = await User.findByIdAndDelete(userId).exec();
   if (!result){
       throw new Error();
   }
}
 
export const updateProfileImages = async(url, imageDestination, userId) => {
    let result;

    if (imageDestination == 'profile') {
        result = await User.findByIdAndUpdate(userId, { profilePicture: url }).exec();
    }
    if (imageDestination == 'header') {
        result = await User.findByIdAndUpdate(userId, { profileHeader: url }).exec();
    }
    return result;
}
 
export const updateProfileBio = async(userId, newBio) => {
   const result = User.findByIdAndUpdate(userId, {bio: newBio}).exec();
   return result;
}
 
export const requestFriend = async(userId, friendId) =>  {// Check this 
   // userId is the user who is sending the request
   const isFriendsOrRequest = await checkIfFriendsOrRequests(userId, friendId);
 
   if (isFriendsOrRequest) { // If they are friends or if there is already a friend request between them then return
       return;
   }
   
   const resultFriendRequest = await User.findByIdAndUpdate(friendId, { $push: { pendingFriends: new mongoose.Types.ObjectId(userId) }}).exec();
   const resultUserRequest = await User.findByIdAndUpdate(userId, { $push: { pendingRequests: new mongoose.Types.ObjectId(friendId) }}).exec();
   return {resultFriendRequest, resultUserRequest};
} 
 
// Checks if both user's are friend or a request between them is established
// Check the friends
export const checkIfFriendsOrRequests = async(userId, friendId) => {
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
 
export const acceptFriend = async(userId, friendId) => {
   // userId is the user who is going to accept the request
   // Delete the pending friend request from the user
   const removeFromPending = await User.findByIdAndUpdate(userId, {$pull: { pendingFriends: friendId }}).exec();
   // Throw error if couldn't delete the friend who made request from the pending list of the user
   if(!removeFromPending){
       return new AppError(400, {error:"Couldn't accept friend request. Request may not exists."})
   }
   // Remove the request from the friend who made the request to the user
   const removeFromRequests = await User.findByIdAndUpdate(friendId, {$pull: { pendingRequests: userId }}).exec();
 
   // When user accepts a friend request, update his friend list and also the user who made the friend request.
   const addToFriendListToUser = await User.findByIdAndUpdate(userId, {$push: { friends: friendId }}).exec();
   const addToFriendListToFriend = await User.findByIdAndUpdate(friendId, {$push: { friends: userId }}).exec();
   return {addToFriendListToUser, addToFriendListToFriend};
}
 
export const rejectFriend = async(userId, friendId) => { // Continue this
   // userId is the user who is going to reject the request
   // Remove the request from the user rejecting
   const removeFromPendingFriend = await User.findByIdAndUpdate(userId, {$pull: { pendingFriends: friendId }}).exec(); 
   // Throw if the request does not exist
   if(!removeFromPendingFriend){
       return new AppError(400, {error:"Couldn't reject friend request. Request may not exist."})
   }
   // Remove the request from the user who initiated the request
   const removeFromPendingRequest = await User.findByIdAndUpdate(friendId, {$pull: { pendingRequests: userId }}).exec();
   
   return {removeFromPendingFriend, removeFromPendingRequest};
}
 
export const removeFriend = async(userId, friendId) => {
   // userId is the user who is going to remote the friend
   const removeFriend = await User.findByIdAndUpdate(userId, {$pull: { friends: friendId }}).exec(); 
   const remoeFromUserFromFriend = await User.findByIdAndUpdate(friendId, {$pull: {friends: userId}}).exec();
   // Throw if the request does not exist
   if(!removeFriend || !remoeFromUserFromFriend){
       return new AppError(400, {error:"Couldn't remove friend"})
   }
 
   return {removeFriend, remoeFromUserFromFriend};
}

