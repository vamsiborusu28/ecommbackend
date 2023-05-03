import dotenv from 'dotenv';

// below method is used to get the config varaibles from env file
dotenv.config();


const config = {
    MONGODB_URL: process.env.MONGODB_URL || "mongodb://localhost:27017/ecommerce",
    PORT: process.env.PORT || 3000,
}



export default config;