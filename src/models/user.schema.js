import mongoose from "mongoose";
import { authRoles } from "../utils/authRoles";
import bcrypt from 'bcryptjs';
import config from "../config/index.js";
import JWT from 'jsonwebtoken';
import crypto from 'crypto';


const userSchema=new mongoose.Schema({
    name:{
        type:String,
        require:[true,"name can't be empty"],
        trim:true,
        maxLength:[80,"name should not contains maximum of 80 characters"],
    },
    email:{
        type:String,
        require:true,
        maxLength:[120,"Email should not contain more than 120 characters"],
    },
    password:{
        type:String,
        require:true,
        minLength:[8,"Password should contain min 8 characters"],
        select:false,
    },
    role:{
        type:String,
        enum:Object.values(authRoles),
        default:authRoles.USER,
    },
    forgetPasswordToken:String,
    expiryDate:Date,
},
{timestamps:true});


// before saving the info  into the database if we want to do some activities in the model we use hooks 
// pre hook is used when we want to do some things before the save
// post hook is after the save

userSchema.pre("save" ,async function(next){
// Password Encryption
if(!this.isModified("password")) return next(); // if password is not modified simply leave it
await bcrypt.hash(this.password, 10) // encrypt the password
 // encrypt the password
next();
});


// userSchema methods

userSchema.methods({
    comparePassword : function(enteredPassword){
        return bcrypt.compare(this.password,enteredPassword);
    },
    // JWT token is used mainly for authorization and Information Exchange
    getJWTToken: function(){
        /* JWT.sign(payload,JWTSecret,options)
        payload contains some info like unique id or something which can be used for generate the token
        JWTSecret is secret key by which we can access the resources if this fell into wrong one the application can get hacked
        options contains info like jwt token expiry like 2d 3d etc
        */
        JWT.sign({_id:this._id,role:this.role},config.JWT_SECRET, {
            expiresIn:config.JWT_EXPIRESIN,
        })        
    },
    getForgetPasswordToken : function(){
        // first create a random token with 20 bytes
        const forgetToken=crypto.getRandomBytes(20).toString('hex');
        // now create an encrypted token sha-256 algo and convert it to hexa decimal
        this.forgetPasswordToken=crypto.createHash('Sha256').update(forgetToken).digest('hex');

        this.expiresIn= Date.now() + 20*60*1000; // 20 minutes
        
        return forgetToken;
    },
})





export default mongoose.model("User",userSchema);
