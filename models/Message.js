import mongoose from 'mongoose';

const Schema = mongoose.Schema

const messageSchema = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model with a matching 'User' schema
    required: true,
  },
  recipientId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model with a matching 'User' schema
    required: true,
  },
  content: {
    type: String,
    required: true,
  }
}, {timestamps: true});

const Message = mongoose.model('Message', messageSchema);
export default Message;
