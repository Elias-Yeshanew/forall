"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
// src/services/email.service.ts
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const transporter = nodemailer_1.default.createTransport({
    host: env_1.env.SMTP_HOST,
    port: env_1.env.SMTP_PORT,
    secure: env_1.env.SMTP_PORT === 465,
    auth: { user: env_1.env.SMTP_USER, pass: env_1.env.SMTP_PASS },
});
exports.emailService = {
    async notifySalesTeam(params) {
        if (!env_1.env.SMTP_USER)
            return; // skip if SMTP not configured
        await transporter.sendMail({
            from: `"Forall Platform" <${env_1.env.EMAIL_FROM}>`,
            to: env_1.env.SALES_EMAIL,
            subject: `New Inquiry: ${params.listingTitle}`,
            html: `
        <div style="font-family:Arial,sans-serif;max-width:520px;padding:24px;background:#f9f5ee;border-radius:12px">
          <h2 style="color:#8B6914;margin-bottom:4px">New Customer Inquiry</h2>
          <p style="color:#555;font-size:13px">via Forall Platform</p>
          <hr style="border:none;border-top:1px solid #ddd;margin:16px 0">
          <table style="width:100%;font-size:14px;color:#333">
            <tr><td style="padding:6px 0;color:#888;width:120px">Customer</td><td><strong>${params.customerName}</strong></td></tr>
            <tr><td style="padding:6px 0;color:#888">Phone</td><td><a href="tel:${params.customerPhone}">${params.customerPhone}</a></td></tr>
            ${params.customerEmail ? `<tr><td style="padding:6px 0;color:#888">Email</td><td><a href="mailto:${params.customerEmail}">${params.customerEmail}</a></td></tr>` : ''}
            <tr><td style="padding:6px 0;color:#888">Listing</td><td>${params.listingTitle}</td></tr>
          </table>
          <div style="background:#fff;border-left:3px solid #C9A84C;padding:12px 16px;margin-top:16px;border-radius:4px;font-size:14px;color:#444">
            "${params.message}"
          </div>
          <p style="font-size:12px;color:#aaa;margin-top:20px">
            Log in to your dashboard to view and manage this inquiry.
          </p>
        </div>
      `,
        });
    },
    async sendListingPublished(email, listingTitle) {
        if (!env_1.env.SMTP_USER || !email)
            return;
        await transporter.sendMail({
            from: `"Forall" <${env_1.env.EMAIL_FROM}>`,
            to: email,
            subject: `Your listing is live: ${listingTitle}`,
            html: `
        <div style="font-family:Arial,sans-serif;max-width:520px;padding:24px">
          <h2 style="color:#C9A84C">Your listing is now live! 🎉</h2>
          <p>Your listing <strong>${listingTitle}</strong> has been approved and is now visible to customers on Forall.</p>
          <p style="color:#888;font-size:13px">Customers who are interested will contact our sales team, who will then reach out to you directly.</p>
          <p style="font-size:12px;color:#aaa;margin-top:20px">Forall — Ethiopia's Premium Broker Platform</p>
        </div>
      `,
        });
    },
};
//# sourceMappingURL=email.service.js.map