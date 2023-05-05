import mongoose, { Mongoose } from 'mongoose';



const productSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true,
        maxLength:[120,"Product name should not exceed 120 chars"]
    },
    price:Number,
    desc:{
        type:String,
        require:true,
    },
    photos:[
        {
            secure_url:{
                type:String,
                require:true,
            }

        }
    ],
    stock:{
        type:Number,
        default:0,

    },
    sold:{
        type:Number,
        default:0,
    },
    collectionId:{
        ref:"Collection",
        type:Mongoose.Schema.Type.ObjectId,
    }
})




export default mongoose.model("Product",productSchema);
