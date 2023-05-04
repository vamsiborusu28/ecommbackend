import User from '../src/models/user.schema.js';
import asyncHandler from '../src/service/asyncHandler.js';
import CustomError from '../src/utils/CustomError.js';


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


