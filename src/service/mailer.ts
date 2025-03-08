import nodemailer from 'nodemailer';
import { EMAIL_HOST, EMAIL_PORT, EMAIL_DISPLAYNAME, EMAIL_USERNAME, EMAIL_PASSWORD } from '@/config';

interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: false,
    auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD,
    }
});

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
    try {
        await transporter.sendMail({
            from: `${EMAIL_DISPLAYNAME} <${EMAIL_USERNAME}>`,
            ...options
        });
        return true;
    } catch {
        return false;
    }
};

// // Usage example
// sendEmail({
//     to: 'tungndtt224@gmail.com',
//     subject: 'Registration Verification Code',
//     html: `
//     <html lang="en">
//         <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <style>
//                 body {
//                     font-family: 'Times New Roman';
//                     margin: 0;
//                     padding: 0;
//                     background-color: #f4f4f4;
//                 }
//                 .email-container {
//                     width: 100%;
//                     max-width: 600px;
//                     margin: 0 auto;
//                     background-color: #ffffff;
//                     border-radius: 8px;
//                     overflow: hidden;
//                     box-shadow: 0 4px 8px rgba(92, 92, 92, 0.1);
//                 }
//                 .email-body {
//                     padding: 30px;
//                     color: #333;
//                     font-size: 16px;
//                 }
//                 .email-body p {
//                     margin: 20px 0;
//                 }
//                 .verification-code {
//                     font-size: 24px;
//                     font-weight: bold;
//                     color: #4CAF50;
//                 }
//             </style>
//         </head>
//         <body>
//             <div class="email-container">
//                 <div class="email-body">
//                     <p>Hello,</p>
//                     <p>Thank you for signing up! To complete your registration, please use the following verification code:</p>
//                     <p class="verification-code">123456</p>
//                     <p>If you did not request this, please ignore this email.</p>
//                 </div>
//             </div>
//         </body>
//     </html>
//     `,
// });
