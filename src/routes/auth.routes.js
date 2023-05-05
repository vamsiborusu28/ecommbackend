import {getProfile, login, logout, signup} from '../controllers/user.controller.js';
import Router from 'express';
import isLoggedIn from './middleware/auth.middleware.js';


const router=Router();

// adding routes to our controllers
router.post('/signup',signup);

router.post('/login',login);

router.get("/logout",logout);


// get profile

router.get("/profile",isLoggedIn,getProfile);




export default router;