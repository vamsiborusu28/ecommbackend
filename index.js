import app from './src/app.js';
import mongoose from 'mongoose';
import config from './src/config/index.js';
// establish mongoose database connection

(async () => {

try{
   await mongoose.connect(config.MONGODB_URL);
   console.log("Database Connected Successfully");

    app.on('error', (error) => 
    {
        console.error(error);
        throw error
    });

    // Listen to the port 
    app.listen(config.PORT, () => {
        console.log(`Application is running on port ${config.PORT} successfully`);
    })
}catch(err){
    console.log("Error",err);
    throw err;
}

}) ()