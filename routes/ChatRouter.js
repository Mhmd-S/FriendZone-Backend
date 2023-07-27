import express from 'express';
import checkAuth from '../authentication/checkAuth';
import * as ChatController from '../controllers/ChatController';

let router = express.Router();

// Get a chat between two users. Takes Page, User Id and Recipient Id as query paramters.
router.get('/get-chat', checkAuth, ChatController.getChat);

// Get One user all chats. Takes Page and User Id as query paramters.
router.get('/user-contacts', checkAuth, ChatController.getChats);



export default router;