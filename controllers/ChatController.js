import { body, validationResult } from 'express-validator';
import { AppError } from '../utils/errorHandler';
import User from '../models/User';
import * as ChatService from '../services/ChatService';
import mongoose from 'mongoose';


export const getChat = async(req,res,next) => {
    try{

        const recipientId = req.query.recipientId;
        const page = req.query.page;
 
        if (!page) next(new AppError(400, "Invalid :page parameter"));

        if (page < 1) next(new AppError(400, "Invalid :page parameter"));

        const chat = await ChatService.getChat(recipientId, req.user._id, page);

        res.json({ status: "success", data: chat });
    } catch (err) {
        next(err);
    }
}

export const getChats = async(req,res,next) => {
    try {
        const userId = req.user._id;
        const page = req.query.page;

        if (!page) next(new AppError(400, "Invalid :page parameter"));

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            next(new AppError(400, "Invalid :userId parameter"));
        }

        if (page < 1) next(new AppError(400, "Invalid :page parameter"));

        const chats = await ChatService.getChats(userId, page);

        res.json({ status: "success", data: chats });
    } catch (err) {
        next(err);
    }
}

// The code below is used by sockets only

export const createChat = async(participants) => {
    try {

        if (!participants) throw new AppError(400, "Invalid :participants parameter");

        if (!Array.isArray(participants)) throw new AppError(400, "Invalid :participants parameter");

        if (participants.length !== 2) throw new AppError(400, "Invalid :participants parameter");

        if (!mongoose.Types.ObjectId.isValid(participants[0]) || !mongoose.Types.ObjectId.isValid(participants[1])) throw new AppError(400, "Invalid :participants parameter");
        
        // check if participants are valid users
        if (!await User.exists({ _id: participants[0] }) || !await User.exists({ _id: participants[1] })) throw new AppError(404, "User not found!");

        const chat = await ChatService.createChat(participants);
        return chat;
    } catch (err) {
        console.log(err);
    }
} 

export const putChat = async(userId, chatId, message) => {
    try {
    
        if (!chatId) throw new AppError(400, "Invalid :chatId parameter");
        
        const chatPartcipants = await ChatService.getParticipants(chatId);

        if (chatPartcipants.participants.indexOf(userId) === -1) throw new AppError(401, "Unauthorized to access chat!");
        
        const recipient = chatPartcipants.participants[0] === userId ? chatPartcipants.participants[0] : chatPartcipants.participants[1];
        const chat = await ChatService.getChat(recipient, userId, 1);

        if (!chat) throw new AppError(404, "Chat not found!");

        const messageObj = {
            senderId: userId,
            recipientId: recipient,
            content: message
        };

        const charResult = await ChatService.putChat(chatId, messageObj);
        return charResult;
    
    } catch (err) {
        console.log(err);
    }
}