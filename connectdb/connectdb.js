import mongoose from "mongoose";

export const connectDataBase  = () =>{
    mongoose.connect(process.env.MONGO_URL,{
        dbName:"HOSPITALMANAGEMENT"
    }).then(()=>{
        console.log("Connected to Database ")
    }).catch((err)=>{
        console.log(err)
    })
}