import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:true,
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
    nic:{
        type:String,
        required:true,
       minLength:[13,'NIC must contain 13 Digits'],
       maxLength:[13,'NIC must contain 13 Digits']
    },
     dob:{
        type:Date,
        required:true,
     },
     gender:{
        type:String,
        required:true,
        enum:["Female","Male"]
     },
     password:{
        type:String,
        required:true,
        minLength:[8,"Password Must Contain Atleast 8 Characters"],
        select:false
     },
     role:{
        type:String,
        required:true,
        enum:["Admin","Patient","Doctor"]
     },
     doctorDepartment:{
        type:String
     },
     docAvatar:{
        public_id:String,
        url:String
     }
})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password =await  bcrypt.hash(this.password,10);
});

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

userSchema.methods.generateJsonWebToken =function (){
    return jwt.sign({id: this._id},
        process.env.JWT_SECRET_KEY ,{
            expiresIn:process.env.JWT_EXPIRES
        }
    )
}



export const User = mongoose.model("User",userSchema);