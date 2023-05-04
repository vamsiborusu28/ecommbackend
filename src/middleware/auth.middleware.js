import User from '../src/models/user.schema.js';
import asyncHandler from '../src/service/asyncHandler.js';
import JWT from 'jsonwebtoken';
import config from '../src/config/index.js';




export const isLoggedIn=asyncHandler( async(req,res,next) => {
        let token;
        // check for the given request contains valid jwt token or not
        if(req.cookies.token || (req.headers.authorization && req.headers.authorization.starsWith('bearer') )){
            token=req.cookies.token || req.headers.authorization.split(" ")[1];
        }

        if(!token){
            throw new CustomError("Not authorized to access this resource",400);
        }

        try{
            const decodedPayload=JWT.verify(token,config.JWT_SECRET);
            req.user=User.findById(decodedPayload._id,"name email role"); // first argument used for finding and second argument used for requested attributes
        }
        catch(error){
            throw new CustomError("Not access to Authorised Resources",400);
        }


});



export const isAuthorized= (...requiredRoles) => asyncHandler(async (req,res,next) => {

    if(!requiredRoles.includes(req.user.role)){
        throw new CustomError("not have access to authorized resources",401);
    }
    next();
})

