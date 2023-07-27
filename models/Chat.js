import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const chatSchema = new Schema({
    participants: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        required: true,
    },
    messages: {
        type: [Schema.Types.ObjectId],
        ref: 'Message',
    },
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message',
    },
}, { timestapms: true});

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;