import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Tranporter;
  constructor(private readonly configService: ConfigService) {
    this.config();
  }

  private config(): void {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: this.configService.get('EMAIL_PORT'),

      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const resetLink = `https://myblog.com/reset-password?token=${token}`;
    const mailOptions = {
      from: 'Auth-backend service',
      to: to,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click the link below to reset your password:</p><p><a href="${resetLink}">Reset Password</a></p>`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
