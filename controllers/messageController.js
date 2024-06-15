import { Message } from "../models/messageSchema.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/errorMiddleware.js";

export const sendMessage = catchAsyncError(async  (req,res,next) =>{
    const {firstName,lastName,email,phone,message} = req.body;
    if(!firstName || !lastName || !email || !phone || !message){
        // return res.status(400).json({
        //     success:false,
        //     message:"Please Provide Full Details"
        // })
        return next(new ErrorHandler("Please Provide Full Details",400));
    }
    await Message.create({firstName,lastName,email,phone,message});
    res.status(200).json({
        success:true,
        message:"Message Sent Successfully"
    })
})

export const getAllMessages = catchAsyncError(async (req,res,next)=>{
    const messages = await Message.find();
    res.status(200).json({
        success:true,
        messages,
    })
})