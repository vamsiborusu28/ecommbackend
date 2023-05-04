import nodemailer from 'nodemailer';
import config from '../src/config/index.js';

let transporter= nodemailer.createTransport({
    host:config.SMTP_HOST,
    port:config.SMTP_PORT,
    auth:{
        user:config.SMTP_MAIL_USERNAME,
        pass:config.SMTP_MAIL_PASS,
    }
});


export default transporter;