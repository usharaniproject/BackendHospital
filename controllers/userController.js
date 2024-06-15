import { User } from "../models/userSchema.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from 'cloudinary'


export const patientRegister = catchAsyncError(async (req,res,next) =>{
    const {firstName,lastName,email,phone,nic,dob,gender,password,role} = req.body;
    if(!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !password || !role){
     return next(new ErrorHandler("Please Provide Full Details"));
    }
    let user = await User.findOne({email});
    if(user){
        return next(new ErrorHandler("User Already Registered",400));
    }
    user = await User.create({firstName,lastName,email,phone,nic,dob,gender,password,role})
    // res.status(200).json({
    //     success:true,
    //     message:"User Registered Successfully"
    // })
    generateToken(user,"User Registered Successfully",200,res)
})



export const login = catchAsyncError(async (req,res,next)=>{
    const {email,password,confirmpassowrd,role}= req.body;
    if(!email || !password ||  !confirmpassowrd || !role){
        return next(new ErrorHandler("Please Provide Full Details"));
    }
    if(password !== confirmpassowrd){
        return next(new ErrorHandler("Password and Confirm Passowrd are not Matching",400));
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid Passowrd and Email",400));
    }
    const isPasswordMatched  = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Passowrd or Email",400));
    }
    if(role !== user.role){
        return next(new ErrorHandler("User with this role is not found",400));
    }
    // res.status(200).json({
    //     success:true,
    //     message:"User Logged in Successfully"
    // })
    generateToken(user,"User Logged in Successfully",200,res)
})



export const addNewAdmin = catchAsyncError(async (req,res,next)=>{
    const {firstName,lastName,email,phone,nic,dob,gender,password}= req.body;
   if(!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !password ){
    return next(new ErrorHandler("Please Provide Full Details"));
   }
   const isRegistered = await User.findOne({email});
   if(isRegistered){
    return next(new ErrorHandler(`${isRegistered} with this email already exists`));
   }
   const admin = await  User.create({firstName,lastName,email,phone,nic,dob,gender,password,role:"Admin"});
   res.status(200).json({
        success:true,
        message:"New Admin Registered Successfully"
    })
})



export const  getAllDoctors = catchAsyncError(async (req,res,next) =>{
    const doctors = await User.find({role:"Doctor"});
    res.status(200).json({
        success:true,
        doctors,
    })
})



export const getUserDetails = catchAsyncError(async (req,res,next)=>{
    const user =req.user;
    res.status(200).json({
        success:true,
        user
    })
})



export const logoutAdmin = catchAsyncError(async (req,res,next)=>{
    res.status(200).cookie("adminToken","",{
        httpOnly:true,
        expires:new Date(Date.now()),
    })
    .json({
        success:true,
        message:"User Log Out Successfully",
    })
})

export const logoutPatient = catchAsyncError(async (req,res,next)=>{
    res.status(200).cookie("patientToken","",{
        httpOnly:true,
        expires:new Date(Date.now()),
    })
    .json({
        success:true,
        message:"User Log Out Successfully",
    })
})

export const addNewDoctor = catchAsyncError(async (req,res,next)=>{
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("Doctor Avatar Required",400));
    }
    const {docAvatar} = req.files;
    const allowedFormats = ['image/png','image/jpeg','image/webp'];
    if(!allowedFormats.includes(docAvatar.mimetype)){
        return next(new ErrorHandler("File Format Not Supported",400));
    }
    const {firstName,lastName,email,phone,nic,dob,gender,password, doctorDepartment} =req.body;
    if(!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !password || !doctorDepartment){
        return next(new ErrorHandler("Please Provide Full Details",400));
    }
    const isRegistered = await User.findOne({email});
    if(isRegistered){
        return next(new ErrorHandler(`${isRegistered.role} already registered with this email`,400));
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(docAvatar.tempFilePath);
    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error("Cloudinary Error:",cloudinaryResponse.error || "Unknown Cloudinary Error");
    } 
    const doctor = await User.create({firstName,lastName,email,phone,nic,dob,gender,password, doctorDepartment,
        role:"Doctor",
        docAvatar:{
           public_id:cloudinaryResponse.public_id,
           url:cloudinaryResponse.secure_url,
        }
});
    res.status(200).json({
    success:true,
    message:"New Doctor was Registerded Successfully"
})
});