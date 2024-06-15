import mongoose from "mongoose";
import validator from "validator";


const appointmentSchema = mongoose.Schema({
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
      appointment_date:{
        type:String,
        required:true
      },
      department:{
        type:String,
        required:true
      },
      doctor:{
        firstName:{
            type:String,
            required:true
        },
        lastName:{
            type:String,
            required:true
        }
      },
      hasVisited:{
        type:Boolean,
        default:false
      },
      doctorId:{
        type:mongoose.Schema.ObjectId,
        required:true
      },
      patientId:{
        type:mongoose.Schema.ObjectId,
        required:true
      },
      address:{
        type:String,
        required:true
      },
      status:{
        type:String,
        enum:["Pending","Accepted","Rejected"]
      }
})


export const Appointment = mongoose.model("Appointment",appointmentSchema);