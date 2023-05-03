import mongoose from "mongoose";


const collectionSchema=new mongoose.Schema({
    name:{
        type:String,
        require:[true,"Collection name should not be empty"],
        trim:true,
        maxLength:[120,"name length should not exceed 120 characters"],
    }
},
{timestamps:true})




export default mongoose.model("Collection",collectionSchema);

