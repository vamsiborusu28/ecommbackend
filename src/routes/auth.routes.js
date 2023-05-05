import {login, signup} from '../controllers/user.controller.js';
import Router from 'express';



const router=Router();

// adding routes to our controllers
router.post('/signup',signup);

router.post('/login',login);




export default router;