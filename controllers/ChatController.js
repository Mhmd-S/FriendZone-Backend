import { body, validationResult } from 'express-validator';
import { AppError } from '../utils/errorHandler';
import User from '../models/User';
import * as ChatService from '../services/ChatService';
import mongoose from 'mongoose';


export const getChat = async(req,res,next) => {
    try{
        const userId = req.user._id;
        const recipientId = req.query.recipientId;
        const page = req.query.page;
 
        if (!page) next(new AppError(400, "Invalid :page parameter"));

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            next(new AppError(400, "Invalid :userId parameter"));
        }

        if (!mongoose.Types.ObjectId.isValid(recipientId)) {
            next(new AppError(400, "Invalid :recipientId parameter"));
        }

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

export const createChat = async(participants, message) => {
    try {
        const chat = await ChatService.createChat(participants, message);
        return chat;
    } catch (err) {
        next(err);
    }
}


export const putChat = async(userId, chatId, message) => {
    try {
        if (!chatId) next(new AppError(400, "Invalid :chatId parameter"));
        
        const chatPartcipants = await ChatService.getParticipants(chatId);
        
        if (chatPartcipants.indexOf(userId) === -1) next(new AppError(401, "Unauthorized to access chat!"));
        
        const chat = await ChatService.getChat(chatId);
        
        if (!chat) next(new AppError(404, "Chat not found!"));

        const messageObj = {
            senderId: userId,
            recipientId: chatPartcipants[0] === userId ? chatPartcipants[1] : chatPartcipants[0],
            content: message
        }

        const message = await ChatService.putChat(chatId, messageObj);
        return chat;
    } catch (err) {
        next(err);
    }
}