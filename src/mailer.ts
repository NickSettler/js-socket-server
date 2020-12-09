import * as nodemailer from 'nodemailer';
import Mail from "nodemailer/lib/mailer";

export type MailerCredentials = {
    user: string;
    pass: string;
}

export type MailerOptions = {
    host: string;
    port: number;
    secure: boolean;
    auth: MailerCredentials;
}

const {SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS} = process.env;

const defaultMailerOptions: MailerOptions = {
    host: SMTP_HOST,
    port: ~~SMTP_PORT,
    secure: true,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    }
}

export default class Mailer {
    private static instance: Mailer;
    private transporter: Mail;

    private constructor(options: MailerOptions = defaultMailerOptions) {
        this.transporter = nodemailer.createTransport({
            ...options
        });
    }

    public static getInstance() {
        if (!Mailer.instance) {
            Mailer.instance = new Mailer();
        }

        return Mailer.instance;
    }

    public async sendMail(options: Mail.Options): Promise<boolean> {
        const result = await this.transporter.sendMail(options);

        return result.response.split(/\s/gm).shift() === '250';
    }
}