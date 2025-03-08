import { Router, Request, Response } from 'express';
import { checkUser, generateExchange, getExchange } from '@/service/database';
import { sendEmail } from '@/service/mailer';

const router = Router();

router.get('', async (req: Request, res: Response) => {
    const email = req.query.email;
    if (!email) {
        res.status(400).send('Missing email');
        return;
    }
    const user = await checkUser(email as string);
    if (user) {
        res.status(404).send('User already exists');
        return;
    }
    const code = await generateExchange(email as string);
    let count = 0;
    let success = false;
    let intervalId = setInterval(async () => {
        success = await sendEmail({
            to: email as string,
            subject: 'Registration Verification Code',
            html: `
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                            font-family: 'Times New Roman';
                            margin: 0;
                            padding: 0;
                            background-color: #f4f4f4;
                        }
                        .email-container {
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #ffffff;
                            border-radius: 8px;
                            overflow: hidden;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        }
                        .email-body {
                            padding: 30px;
                            color: #333;
                            font-size: 18px;
                        }
                        .email-body p {
                            margin: 20px 0;
                        }
                        .verification-code {
                            font-size: 26px;
                            font-weight: bold;
                            color: #4CAF50;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <div class="email-body">
                            <p>Hello,</p>
                            <p>Thank you for signing up! To complete your registration, please use the following verification code:</p>
                            <p class="verification-code">${code}</p>
                            <p>If you did not request this, please ignore this email.</p>
                        </div>
                    </div>
                </body>
            </html>
            `,
        });
        if(success || count++ > 30) {
            clearInterval(intervalId);
        }
    }, 2000);
    if(!success) {
        res.status(500).send('Failed to send verification email');
    } else {
        res.status(200).send('Verification email sent');
    }
});

router.get('/callback', async (req: Request, res: Response) => {
    const code = req.query.code;
    if (!code) {
        res.status(400).send('Missing authorization code');
        return;
    }
    const exchange = await getExchange(code as string);
    if (!exchange) {
        res.status(400).send('Invalid authorization code');
        return;
    }
    res.status(200).send({ 
        email: exchange.email, 
        username: '', 
        code: exchange.code,
    });
});

export default router;
