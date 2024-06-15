import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { connectDataBase } from './connectdb/connectdb.js';
import messageRoute from './routes/messageRoute.js'
import userRoute from './routes/userRoute.js'
import appointmentRoute from './routes/appointmentRoute.js'
import { errorMiddleware } from './middleware/errorMiddleware.js';
const app =express();
config({path:"./config/config.env"})
app.use(cors({
    origin:[process.env.FRONTED_URL,process.env.DASHBOARD_URL],
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:'/tmp'
}))
app.use('/api/v1/message',messageRoute);
app.use('/api/v1/user',userRoute)
app.use('/api/v1/appointment',appointmentRoute);
connectDataBase();
app.use(errorMiddleware)
export default app
