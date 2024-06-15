import mongoose from "mongoose";
import validator from "validator";

const messageSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:[3,"First Name must contain atleast 3 characters"]
    },
    lastName:{
        type:String,
        required:true,
        minLength:[3,"Last Name must contain atleast 3 characters"]
    },
    email:{
        type:String,
        required:true,
        validate:[validator.isEmail, "Please Enter a Valid email"]
    },
    phone:{
        type:String,
        required:true,
        minLength:[10," Phone Number Must contain atleast 10 digits"]
    },
    message:{
        type:String,
        required:true,
       minLength:[10,'Message must contain atleast 10 characters']
    }
})

export const Message = mongoose.model("Message",messageSchema);