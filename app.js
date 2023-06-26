import 'dotenv/config';
import express from 'express';
import {mongoose} from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import configurePassport from './authentication/passport-config';
import { AppError, errorHandlers } from './utils/errorHandler';
import  MongoStore from 'connect-mongo';

// Import routers
import UserRouter from './routes/UserRouter';
import PostRouter from './routes/PostRouter';   

const app = express();

// Setting up mongo database
mongoose.set('strictQuery', false);

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}

main().catch(err => console.error("Cannot connect to database"));

// Configs for the global middleware
const corsOption = { // Change later. // Config for the CORS
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false,
    'optionsSuccessStatus': 204
  }

// Configuring passport
const passport = configurePassport();  

// Global middleware
app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(session({ secret: process.env.session_secret, 
                resave:false, 
                saveUninitialized:false, 
                store: MongoStore.create({
                    client: mongoose.connection.getClient()
                }),
                cookie: {
                    maxAge: 1000 * 30
                }  
            }));
app.use(passport.initialize());
app.use(passport.session());

// Routers
app.use('/user', UserRouter);
app.use('/post', PostRouter);


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

app.listen(process.env.PORT, ()=> {
    console.log(`Listening at port ${process.env.PORT}`);
})
