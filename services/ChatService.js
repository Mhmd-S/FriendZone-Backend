import Message from '../models/Message';
import Chat from '../models/Chat';

export const getParticipants = async(chatId) => {
    const result = await Chat.findById(chatId)
                                .populate('participants', 'username profilePicture')
                                .exec();
    return result; 
}

export const getChat = async(recipientId, userId,page) => {
    const result = await Chat.find({ participants: { $in: [userId, recipientId ] }}).populate({
        path: 'messages',
        options: {
            sort: { createdAt: -1 },
            limit: 50,
            skip: (page-1) * 50
        },
        populate: {
            path: 'author',
            select: 'username profilePicture'
        }
    }).exec();

    return result;
}

export const getChats = async(userID, page) => {
    console.log(Chat);
    const result = await Chat.find({ participants: { $in: [userID] } })
        .populate('participants', 'username profilePicture')
        .populate('lastMessage', 'content createdAt')
        .sort({ updatedAt: -1 })
        .skip((page - 1) * 20)
        .limit(20)
        .exec();

    return result;
}

 export const createChat = async(participants, message) => {
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