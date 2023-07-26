import mongoose from 'mongoose';
import Message from '../models/Message';
import Chat from '../models/Chat';

export const getParticipants = async(chatId) => {
    const result = Chat.findById(chatId).populate('participants', 'username profilePicture').exec();
    return result; 
}

export const getChat = async(chatId) => {
    const result = await Chat.findById(chatId).populate({
        path: 'messages',
        populate: {
            path: 'author',
            select: 'username profilePicture'
        }
    }).exec();
    return result;
}

 export const createChat = async(participants) => {
    const chat = new Chat({ participants: participants });
    const result = await chat.save();
    return result;
}

export const checkChatExists = async(chatId) => { 
    const result = await Chat.findById(chatId, 'createdAt').exec();
    if (result) {
        return true;
    } else {
        return false;
    }
}

export const putChat = async(chatId, messageObj) => {
    const message = new Message({...messageObj});
    const messageResult = await message.save();
    
    const chatResult = await Chat.findByIdandUpdate(chatId, { lastMessage: messageResult._id, $push: { messages: messageResult._id } }).exec();
    return chatResult;
}