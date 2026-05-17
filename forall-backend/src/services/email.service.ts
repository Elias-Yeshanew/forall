// src/services/email.service.ts
import nodemailer from 'nodemailer'
import { env } from '../config/env'

const transporter = nodemailer.createTransport({
  host:   env.SMTP_HOST,
  port:   env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth:   { user: env.SMTP_USER, pass: env.SMTP_PASS },
})

interface SalesNotifyParams {
  customerName:  string
  customerPhone: string
  customerEmail?: string | null
  message:       string
  listingTitle:  string
  listingId:     string
}

export const emailService = {
  async notifySalesTeam(params: SalesNotifyParams) {
    if (!env.SMTP_USER) return // skip if SMTP not configured

    await transporter.sendMail({
      from:    `"Forall Platform" <${env.EMAIL_FROM}>`,
      to:      env.SALES_EMAIL,
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
    })
  },

  async sendListingPublished(email: string, listingTitle: string) {
    if (!env.SMTP_USER || !email) return

    await transporter.sendMail({
      from:    `"Forall" <${env.EMAIL_FROM}>`,
      to:      email,
      subject: `Your listing is live: ${listingTitle}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:520px;padding:24px">
          <h2 style="color:#C9A84C">Your listing is now live! 🎉</h2>
          <p>Your listing <strong>${listingTitle}</strong> has been approved and is now visible to customers on Forall.</p>
          <p style="color:#888;font-size:13px">Customers who are interested will contact our sales team, who will then reach out to you directly.</p>
          <p style="font-size:12px;color:#aaa;margin-top:20px">Forall — Ethiopia's Premium Broker Platform</p>
        </div>
      `,
    })
  },
}
