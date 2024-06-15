import { User } from "../models/userSchema.js";
import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "./errorMiddleware.js";
import jwt from 'jsonwebtoken';


export const isAdminAuthenticated = catchAsyncError(async (req, res, next) => {
   const token = req.cookies.adminToken;

   if (!token) {
       return next(new ErrorHandler("Admin Not Authenticated", 400));
   }

   // Log the token and secret key for debugging
   console.log("Token:", token);
   console.log("Secret Key:", process.env.JWT_SECRET_KEY);

   try {
       // Decode the token without verification to inspect it
       const decodedWithoutVerification = jwt.decode(token);
       console.log("Decoded Token Without Verification:", decodedWithoutVerification);

       // Verify the token
       const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
       console.log("Verified Token:", decoded);

       // Attempt to find the user in the database
       const user = await User.findById(decoded.id);
       console.log("User from database:", user);

       if (!user) {
           // Log more details if user not found
           console.error("User not found in the database for ID:", decoded.id);
           return next(new ErrorHandler("User not found", 404));
       }

       if (user.role !== "Admin") {
           return next(new ErrorHandler(`${user.role} not authorised for this resource!`, 403));
       }

       // Attach the user to the request
       req.user = user;
       next();
   } catch (error) {
       console.error("JWT Verification Error:", error.message);
       return next(new ErrorHandler("Invalid token", 400));
   }
});





export const isPatientAuthenticated = catchAsyncError(async (req, res, next) => {
   const token = req.cookies.patientToken;

   if (!token) {
       return next(new ErrorHandler("Patient Not Authenticated", 400));
   }

   // Log the token and secret key for debugging
   console.log("Token:", token);
   console.log("Secret Key:", process.env.JWT_SECRET_KEY);

   try {
       // Decode the token without verification to inspect it
       const decodedWithoutVerification = jwt.decode(token);
       console.log("Decoded Token Without Verification:", decodedWithoutVerification);

       // Verify the token
       const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
       console.log("Verified Token:", decoded);

       req.user = await User.findById(decoded.id);
       if (!req.user) {
           return next(new ErrorHandler("User not found", 404));
       }

       if (req.user.role !== "Patient") {
           return next(new ErrorHandler(`${req.user.role} not authorised for this resource!`, 403));
       }

       next();
   } catch (error) {
       console.error("JWT Verification Error:", error.message);
       return next(new ErrorHandler("Invalid token", 400));
   }
});