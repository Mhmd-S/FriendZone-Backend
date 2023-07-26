import { body, validationResult } from 'express-validator';
import { AppError } from '../utils/errorHandler';
import User from '../models/User';
import * as ChatService from '../services/ChatService';
import mongoose from 'mongoose';

export const getChat = async(req,res,next) => {
    try{
        const userId = req.user._id;
        const chatId = req.params.chatId;

        if (!chatId)  next(new AppError(400, "Invalid :chatId parameter"))

        const chatPartcipants = await ChatService.getParticipants(chatId);

        if (chatPartcipants.indexOf(userId) === -1) {
            next(new AppError(401, "Unauthorized to view chat!"));
        }

        const chat = await ChatService.getChat(chatId);

        res.json({ status: "success", data: chat });
    } catch (err) {
        next(err);
    }
}

export const getChats = async(req,res,next) => {
    try {
        const userId = req.user._id;
        const page = req.user.page;

        const chats = await ChatService.getChats(userId, page);

        res.json({ status: "success", data: chats });
    } catch (err) {
        next(err);
    }
}

export const createChat = [
    body('participants')
        .exists().withMessage("participants is required")
        .isArray().withMessage("participants must be an array")
        .isLength({ min: 2, max: 2 }).withMessage("participants must be an array of length 2")
        .custom((value, { req }) => {
            if (value[0] === value[1]) {
                throw new Error("participants must be different");
            }
            if (!mongoose.Types.ObjectId.isValid(value[0]) || !mongoose.Types.ObjectId.isValid(value[1])) {
                throw new Error("participants must be valid objectIds");
            }
    
            const user1 = User.findById(value[0]);
            if (!user1) throw new Error("participants must be valid objectIds");
    
            const user = User.findById(value[1]);
            if (!user) throw new Error("participants must be valid objectIds");
    
            return true;
        }),
    async(req,res,next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new AppError(400, "Invalid participants body")
            }

            const participants = req.body.participants;

            const chat = await ChatService.createChat(participants);

            res.json({ status: "success", data: chat });
        } catch (err) {
            next(err);
        }
    }
]

export const putChat = [
    body('message')
        .exists().withMessage("message is required")
        .isString().withMessage("message must be a string")
        .isLength({ min: 1, max: 1000 }).withMessage("message must be between 1 and 1000 characters")
        .escape(),
    async(req,res,next) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                throw new AppError(400, "Invalid message body")
            }

            const userId = req.user._id;
            const chatId = req.params.chatId;

            if (!chatId) next(new AppError(400, "Invalid :chatId parameter"));

            const chatPartcipants = await ChatService.getParticipants(chatId);

            if (chatPartcipants.indexOf(userId) === -1) next(new AppError(401, "Unauthorized to access chat!"));

            const chat = await ChatService.getChat(chatId);

            res.json({ status: "success", data: chat });
        } catch (err) {
            next(err);
        }
    }
]