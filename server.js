import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors';
import {UserRouter} from './routes/UserRoutes.js';
import {RoomsRouter} from './routes/CruiseRoute.js';
import cookieParser from 'cookie-parser';
dotenv.config()


const app=express()
app.use(cors({
    origin: ['http://localhost:3005' ],
    credentials:true
}));
app.use(express.json())
app.use('/client',UserRouter)
app.use('/api/explore',RoomsRouter)


mongoose.connect('mongodb+srv://Cruise:Cruise@cluster0.y4emazr.mongodb.net/')



const port = process.env.PORT || 3010;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});