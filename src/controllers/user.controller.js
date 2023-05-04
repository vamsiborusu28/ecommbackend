import User from '../models/user.schema.js';
import asyncHandler from '../service/asyncHandler.js';
import CustomError from '../utils/CustomError.js';
import transporter from '../config/transporter.config.js';

const cookieOptions={
 cookieExpiry:Date.now() + 2*24*60*60*1000, // 2days
 httpOnly:true,
}

export const signup = asyncHandler(async (req,res) => {
    const {name,email,password,role}=req.body;

    if(!name || !email || !password || !role){
        throw new CustomError("Fields cannot be empty",400);
    }

    const exists=User.findOne({email});
    if(exists){
        throw new CustomError("user already exists",400);
    }

    const user=User.create({
        name,email,password,email
    });

    user.password=undefined;

    // generate jwt token
    const token=user.getJWTToken();

    /* send the above jwt token to our front end user can access the token to authorize the resources 
    and the cookie should expire also because it should not stay forever
    */

    res.cookie("token",token,cookieOptions);


    // send the response back to the user
    res.status(201).json({
        sucess:true,
        message:"user added successfully",
        user
    })
    
});



export const login =asyncHandler( async (req,res) => {
     const {email,password}=req.body;

     if(!email || !password){
        throw new CustomError("Please cannot be empty",400);
     }

     const user=User.findOne({email}).select("+password");

     if(!user){
        throw new CustomError("User not found",400);
     }

    const comparePassword=user.comparePassword(password);

    if(comparePassword){
        //get jwt token
        const token=user.getJWTToken();

        // add this token to cookie
        res.cookie("token",token,cookieOptions);

        //return the response
        res.status(200).json({
            sucess:true,
            message:"login found successfully",
            user,
            token,
        })
       
    }
    throw new CustomError("password incorrect",400);
});



export const logout= asyncHandler( async(req,res) => {

    res.cookie("token",null,{
        expiresIn:new Date(Date.now()),
        httpOnly:true,
    });

    res.status(200).json({
        sucess:true,
        message:"user logged out successfully",
        token,
    })
});


// get profile

export const getProfile=asyncHandler( async(req,res) => {
   const {user}=req.body;

   if(!user){
    throw new CustomError("user not found",400);
   }

   res.status(200).json({
    success:true,
    user
   })

})


export const forgetPassword= asyncHandler( async (req,res) => {
    const {email} =req.body;

    if(!email){
        throw new CustomError("email cannot be empty",400);
    }

    const user=User.findOne({email});

    if(!user){
        throw new CustomError("user not found",401);
    }


    const forgetToken=user.generateForgetPasswordToken();

    user.save({validateBeforeSave:false});

    const resetUrl=`${req.protocol}://${req.get('host')}/api/v1/auth/password/reset/${forgetToken}`;

    const message=`Your password reset token is as follows \n\n ${resetUrl} \n\n if this was not requested by you, please ignore.`;

    try{
       await  transporter.sendMail({
            email:user.email,
            subject:'password reset mail',
            message
        })
    }catch(error){
        user.forgetPasswordToken=undefined;
        user.forgetPasswordExpiry=undefined;

        user.save({validateBeforeSave:false});

        throw new CustomError(error.message || "email could not be sent" ,500);

    }

});


export const resetPassword=asyncHandler( async (req,res) => {
    // get the data from the front end restToken and password confirmPassword

    const {token:resetToken}=req.params;
    const {password,confirmPassword}=req.body;

    // decrypt the token and search for it in database
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    const user=User.findOne({
        forgetPasswordToken:resetPasswordToken,
        forgetPasswordExpiry:{ $gt : Date.now() },
    })


    if(!user){
        throw new CustomError("token is invalid or expired",400);
    }

    if(password!==confirmPassword){
        throw new CustomError("Password does not match",400);
    }

    user.password=password;
    user.forgetPasswordToken=undefined;
    user.forgetPasswordExpiry=undefined;

    user.save();

    // since the password is changed generate JWT Token one more time and send it back to the user
    const token=user.getJWTToken();

    res.status(200).json({
        success:true,
        message:"password is resetted",
        token,
        user
    });

})