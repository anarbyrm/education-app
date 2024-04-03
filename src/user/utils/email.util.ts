import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';

dotenv.config();

@Injectable()
export class MailService {
    constructor() {}

    async prepareDevTransport() {
        const account = await nodemailer.createTestAccount();
        const transport = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
                user: account.user,
                pass: account.pass,
            }
        });
        return transport;
    }

    prepareProdTransport() {
        const transport = nodemailer.createTransport({ 
            host: process.env.SMTP_HOST || 'admin@example.com',
            port: +process.env.SMTP_PORT,
            secure: process.env.NODE_ENV === 'prod',
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD,
            }
        });
        return transport;
    }

    async sendActivationMail(email: string, token: string) {
        const transport = process.env.NODE_ENV === 'prod' 
                            ? this.prepareProdTransport() 
                            : await this.prepareDevTransport();

        const mail = await transport.sendMail({
            from: process.env.SMTP_SENDER,
            to: email,
            subject: "User account activation in education app.",
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>User activation email</title>
                </head>
                <body>
                    <div>
                        <h1>Click the link below to activate your account</h1>
                        <p><a href="http://${process.env.HOST}/students/activate?token=${token}">Activate account.</a></p>
                    </div>
                </body>
                </html>
            `
        })
        return mail;
    }

}
