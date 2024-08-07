import express, { Request, Response } from "express";
import connectDB from "./config/database";
import * as dotenv from 'dotenv';
import cors from 'cors';
import ErrorHandler from "./middleware/ErrorHandler";
import authRoutes from './route/authRoutes';
import userRoutes from './route/userRoutes';
import routersRoutes from './route/routesRoutes';
import busRoutes from './route/busRoutes'
import bookingRoutes from './route/bookingRoutes'
dotenv.config();


const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/routes', routersRoutes)
app.use('/api/bus', busRoutes)
app.use('/api/booking', bookingRoutes)
app.use(ErrorHandler)

connectDB().then(() => {

    app.listen(port, () => {
        console.log(`Server is On At Port 3000`);

    })
}).catch((error: any) => {
    console.log("Error starting server :", error.message);
});
