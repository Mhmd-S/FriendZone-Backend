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
        default: [],
    },
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message',
        default: null,
    },
}, { timestamps: true});

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;