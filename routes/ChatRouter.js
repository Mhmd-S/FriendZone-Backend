import express from 'express';
import checkAuth from '../authentication/checkAuth';
import * as ChatController from '../controllers/ChatController';

let router = express.Router();

router.get('/user', checkAuth, ChatController.getChats);
router.get('/:chatId', checkAuth, ChatController.getChat);
router.post('/create-chat', checkAuth, ChatController.createChat);
router.put('/:chatId', checkAuth, ChatController.putChat);



export default router;