import 'dotenv/config';
import express from 'express';
import {mongoose} from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import configurePassport from './authentication/passport-config';
import { AppError, errorHandlers } from './utils/errorHandler';
import  MongoStore from 'connect-mongo';
import { Server } from 'socket.io';
const fs = require('fs');

//Import Controller for the Chat to be used in sockets
import * as ChatController from './controllers/ChatController';

// Import routers
import UserRouter from './routes/UserRouter';
import PostRouter from './routes/PostRouter';     
import CommentRouter from './routes/CommentRouter'; 
import ChatRouter from './routes/ChatRouter';

import { createServer } from 'http';

const app = express();

const httpServer = createServer(app);

// Setting up mongo database
mongoose.set('strictQuery', false);

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}

main().catch(err => console.error("Cannot connect to database"));
// FIx the session
// Configs for the global middleware
const corsOption = { // Change later. // Config for the CORS
    'origin': 'http://127.0.0.1:5173',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false,
    'optionsSuccessStatus': 204,
    'credentials' : true,
  }

// Configuring passport
const passport = configurePassport();  

// Global middleware
app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionMiddleware = session({ 
    secret: process.env.session_secret, 
    resave:false, 
    saveUninitialized:false, 
    store: MongoStore.create({
        client: mongoose.connection.getClient()
    }),
    cookie: {
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
})

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// Routers
app.use('/user', UserRouter);
app.use('/post', PostRouter);
app.use('/comment', CommentRouter);
app.use('/chat', ChatRouter);

// Catching 404 and forwarding it to error handler
app.use((req,res,next) => {
    next(new AppError(404, 'Not Found'));
});

app.use((err,req,res,next) => {
    console.log(err)
    if (err instanceof mongoose.Error.ValidationError) {
        errorHandlers.handleDbValidationError(err,res);
    }else if ( err instanceof mongoose.Error.CastError) {
        errorHandlers.handleDbCastError(err,res);
    } else {
        errorHandlers.handleError(err,res);
    }
});

const io = new Server(httpServer, {
    cors: {
        origin: "http://127.0.0.1:5173",
        credentials: true
    },
    connectionStateRecovery: {
        // the backup duration of the sessions and the packets
        maxDisconnectionDuration: 2 * 60 * 1000,
    },
});

// convert a connect middleware to a Socket.IO middleware
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.use((socket, next) => {
    console.log(socket.request.user);
    if (socket.request.user) {
      next();
    } else {
      next(new Error("unauthorized"));
    }
  });

// Create a Map to store user IDs and their corresponding socket IDs
const userSocketMap = new Map();

io.on('connection', (socket) => {
  console.log('A user connected');

  // Assume you have the user ID available in socket.request.session.userId
  const userId = socket.request.user._id;

  // Store the association between user ID and socket ID in the map
  userSocketMap.set(userId, socket.id);

  socket.join(userId);

  // socket.onAny((data)=>{
  //   console.log(data);
  // })

  socket.on('message', async(data) => {
    const recipientId = data.recipientId;

    // Get the recipient's socket ID from the map
    const recipientSocketId = userSocketMap.get(recipientId);

    // Check if the recipient is online (has a socket connection)
    if (recipientSocketId && io.sockets.sockets.has(recipientSocketId)) {
      // Emit the message only to the intended recipient's socket
      io.to(recipientSocketId).emit('message', data);
    } else {
      // Handle the case when the recipient is offline or not found
      // For example, you can store the message in the database and send it later when the recipient comes online
      console.log(`Recipient ${recipientId} is offline or not found`);
    }
    console.log(data);
    // Save data to the database
    try{
    if(data.newChat) {
      const result = await ChatController.createChat([userId, data.recipientId]);
      const chatAddMessageResult = await ChatController.putChat(userId,result._id, data.message);
    } else {
      const result = await ChatController.putChat(userId, data.chatId, data.message);
    }
  } catch(err) {
    console.log(err);
  }

  });

  socket.on('disconnect', () => {
    // Remove the association when the socket disconnects
    userSocketMap.delete(userId);

    console.log('A user disconnected');
  });
});

httpServer.listen(process.env.Port || 3001, ()=> {
    console.log(`Listening at at port ${process.env.PORT}`);
});
 
