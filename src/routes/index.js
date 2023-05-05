import Router from 'express';
import authRoutes from '../auth.routes.js';
const router=Router();



router.use('/user',authRoutes);




export default router;