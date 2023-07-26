import express from 'express';
import checkAuth from '../authentication/checkAuth';
import * as ChatController from '../controllers/ChatController';

let router = express.Router();

router.get('/:chatId', checkAuth, ChatController.getChat);
router.get('/chat/user', checkAuth, ChatController.getChats);
router.post('/create-chat', checkAuth, ChatController.createChat);
router.put('/:chatId', checkAuth, ChatController.putChat);



export default router;