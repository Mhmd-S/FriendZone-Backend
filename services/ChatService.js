import Message from '../models/Message';
import Chat from '../models/Chat';

export const getParticipants = async(chatId) => {
    const result = await Chat.findById(chatId, 'participants')
                                .exec();
    return result; 
}

export const getChat = async(recipientId, userId,page) => {
    const result = await Chat.findOne({ participants: { $in: [userId, recipientId ] }}).populate({
        path: 'messages',
        select: 'senderId content createdAt',
        options: {
            sort: { createdAt: -1 },
            limit: 50,
            skip: (page-1) * 50
        },
    }).exec();

    return result;
}

export const getChats = async(userID, page) => {
    const result = await Chat.find({ participants: { $in: [userID] } }, 'participants lastMessage')
        .populate('participants', 'username profilePicture')
        .populate('lastMessage', 'content updatedAt')
        .sort({ updatedAt: -1 })
        .skip((page - 1) * 20)
        .limit(20)
        .exec();

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
    
    const chatResult = await Chat.findByIdAndUpdate(chatId, { lastMessage: messageResult._id, $push: { messages: messageResult._id } }).exec();
    return chatResult;
}