import nodemailer from 'nodemailer';
import ejs from 'ejs';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';


dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure: false,
    port: 587,
    auth: {
      user: process.env.NODEMAILER_USER as string,
      pass: process.env.NODEMAILER_PASS as string,
    },
  });

 export const registrationConfirmationEmail = async (email:string, userName:string,role :string)=>{
    try{
        const emailTemplate = path.join(__dirname, '../email/registrationConfirmation.ejs');

        const renderHtml = await ejs.renderFile(emailTemplate, { userName, role,message: "Welcome to our platform! We are excited to have you on board." });

        const mailOptions = {
            from: process.env.NODEMAILER_USER,
            to: email,
            subject: "Registration Confirmation",
            html: renderHtml
        };

        await transporter.sendMail(mailOptions);
        console.log("Registration Confirmation Email Sent to: ", email);

    }catch(error:any){
        console.error("Failed to send Registration Confirmation Email: ", error);
        throw new Error("Failed to send Registration Confirmation Email");
    }

  }