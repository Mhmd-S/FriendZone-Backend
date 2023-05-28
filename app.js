import 'dotenv/config';
import express from 'express';
import {mongoose} from 'mongoose';
import cors from 'cors';
import passport from 'passport';

import { errorHandlers } from './utils/errorHandler';

const app = express();

// Setting up mongo database
mongoose.set('strictQuery', false);

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}

main().catch(err => console.log('Mongo Connection error'));

// Configs for the global middleware
const corsOption = { // Change later. // Config for the CORS
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false,
    'optionsSuccessStatus': 204
  }

// Global middleware
app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(passport.initialize());

// Routers

// Catching 404 and forwarding it to error handler
app.use((req,res,next) => {
    next(createHttpError(404));
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
