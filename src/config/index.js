import dotenv from 'dotenv';

// below method is used to get the config varaibles from env file
dotenv.config();


const config = {
    MONGODB_URL: process.env.MONGODB_URL || "mongodb://localhost:27017/ecommerce",
    PORT: process.env.PORT || 3000,
    JWT_SECRET:process.env.JWT_SECRET || "yoursecret",
    JWT_EXPIRESIN:process.env.JWT_EXPIRESIN || "10d",
    SMTP_HOST:process.env.SMTP_HOST || "smtpmail",
    SMTP_PORT:process.env.SMTP_PORT || 300,
    SMTP_MAIL_USERNAME:process.env.SMTP_MAIL_USERNAME,
    SMTP_MAIL_PASSWORD:process.env.SMTP_MAIL_PASSWORD,
}



export default config;