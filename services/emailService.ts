/**
 * Email Service Integration
 *
 * This module provides a unified interface for sending transactional emails.
 * Configure one of the following providers by setting the appropriate environment
 * variables in your .env.local file:
 *
 *   VITE_EMAIL_PROVIDER=resend | sendgrid | ses
 *   VITE_RESEND_API_KEY=re_...
 *   VITE_SENDGRID_API_KEY=SG....
 *
 * NOTE: In a production app, email sending should happen server-side (e.g., via
 * Supabase Edge Functions or a Next.js API route) to protect your API keys.
 * This file demonstrates the template structure and can be adapted for that use.
 */

export interface OrderConfirmationData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    selectedSize: string;
    selectedColor: string;
  }>;
  totalAmount: number;
  shippingAddress?: string;
}

export interface ShippingNotificationData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  trackingNumber: string;
  estimatedDelivery: string;
  carrier: string;
}

// ── HTML Email Templates ──────────────────────────────────────────────────────

export const templates = {
  orderConfirmation: (data: OrderConfirmationData): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmed — Vérixa</title>
</head>
<body style="margin:0;padding:0;background:#f9f7f4;font-family:'Georgia',serif;">
  <div style="max-width:580px;margin:0 auto;padding:40px 20px;">
    <!-- Header -->
    <div style="text-align:center;padding:32px;background:#1a1a1a;border-radius:12px 12px 0 0;">
      <h1 style="color:#fff;font-size:28px;letter-spacing:-1px;margin:0;">VÉRIXA</h1>
    </div>
    <!-- Body -->
    <div style="background:#fff;padding:40px;border-radius:0 0 12px 12px;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
      <div style="text-align:center;margin-bottom:32px;">
        <div style="width:64px;height:64px;background:#dcfce7;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:28px;">✓</div>
        <h2 style="font-size:22px;color:#1a1a1a;margin:16px 0 8px;">Order Confirmed!</h2>
        <p style="color:#888;font-size:14px;margin:0;">Thank you, ${data.customerName}. Your order has been received.</p>
      </div>
      
      <!-- Order ID -->
      <div style="background:#f9f7f4;border-radius:8px;padding:16px;margin-bottom:24px;text-align:center;">
        <p style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 4px;">Order ID</p>
        <p style="color:#1a1a1a;font-size:18px;font-weight:bold;margin:0;font-family:monospace;">${data.orderId}</p>
      </div>

      <!-- Items -->
      <h3 style="font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#888;margin-bottom:12px;">Your Items</h3>
      ${data.items.map(item => `
        <div style="display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid #f0ede8;">
          <div>
            <p style="font-size:14px;color:#1a1a1a;margin:0 0 4px;font-weight:bold;">${item.name}</p>
            <p style="font-size:12px;color:#888;margin:0;">Size: ${item.selectedSize} · Color: ${item.selectedColor} · Qty: ${item.quantity}</p>
          </div>
          <p style="font-size:14px;font-weight:bold;color:#1a1a1a;margin:0;">₹${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      `).join('')}

      <!-- Total -->
      <div style="display:flex;justify-content:space-between;padding-top:16px;margin-top:4px;">
        <p style="font-size:16px;font-weight:bold;color:#1a1a1a;margin:0;">Total</p>
        <p style="font-size:16px;font-weight:bold;color:#1a1a1a;margin:0;">₹${data.totalAmount.toFixed(2)}</p>
      </div>

      ${data.shippingAddress ? `
        <div style="margin-top:24px;padding:16px;background:#f9f7f4;border-radius:8px;">
          <p style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#888;margin:0 0 8px;">Shipping To</p>
          <p style="font-size:14px;color:#1a1a1a;margin:0;">${data.shippingAddress}</p>
        </div>
      ` : ''}

      <a href="https://verixa.com/#/orders" style="display:block;text-align:center;background:#1a1a1a;color:#fff;padding:16px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;margin-top:32px;">
        Track Your Order
      </a>
    </div>
    <p style="text-align:center;color:#bbb;font-size:12px;margin-top:24px;">© ${new Date().getFullYear()} Vérixa. All rights reserved.</p>
  </div>
</body>
</html>
  `,

  shippingNotification: (data: ShippingNotificationData): string => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Your Order Has Shipped — Vérixa</title></head>
<body style="margin:0;padding:0;background:#f9f7f4;font-family:'Georgia',serif;">
  <div style="max-width:580px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;padding:32px;background:#1a1a1a;border-radius:12px 12px 0 0;">
      <h1 style="color:#fff;font-size:28px;letter-spacing:-1px;margin:0;">VÉRIXA</h1>
    </div>
    <div style="background:#fff;padding:40px;border-radius:0 0 12px 12px;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
      <div style="text-align:center;margin-bottom:32px;">
        <div style="font-size:48px;">📦</div>
        <h2 style="font-size:22px;color:#1a1a1a;margin:16px 0 8px;">Your Order Is On Its Way!</h2>
        <p style="color:#888;font-size:14px;margin:0;">Hi ${data.customerName}, your order has been shipped.</p>
      </div>
      
      <div style="background:#f9f7f4;border-radius:8px;padding:20px;margin-bottom:24px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
          <span style="color:#888;font-size:13px;">Order ID</span>
          <span style="font-family:monospace;font-weight:bold;color:#1a1a1a;font-size:13px;">${data.orderId}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
          <span style="color:#888;font-size:13px;">Tracking Number</span>
          <span style="font-family:monospace;font-weight:bold;color:#1a1a1a;font-size:13px;">${data.trackingNumber}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
          <span style="color:#888;font-size:13px;">Carrier</span>
          <span style="font-weight:bold;color:#1a1a1a;font-size:13px;">${data.carrier}</span>
        </div>
        <div style="display:flex;justify-content:space-between;">
          <span style="color:#888;font-size:13px;">Estimated Delivery</span>
          <span style="font-weight:bold;color:#1a1a1a;font-size:13px;">${data.estimatedDelivery}</span>
        </div>
      </div>

      <a href="#" style="display:block;text-align:center;background:#1a1a1a;color:#fff;padding:16px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">
        Track Shipment
      </a>
    </div>
    <p style="text-align:center;color:#bbb;font-size:12px;margin-top:24px;">© ${new Date().getFullYear()} Vérixa. All rights reserved.</p>
  </div>
</body>
</html>
  `,

  accountVerification: (name: string, verificationLink: string): string => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Verify Your Email — Vérixa</title></head>
<body style="margin:0;padding:0;background:#f9f7f4;font-family:'Georgia',serif;">
  <div style="max-width:580px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;padding:32px;background:#1a1a1a;border-radius:12px 12px 0 0;">
      <h1 style="color:#fff;font-size:28px;letter-spacing:-1px;margin:0;">VÉRIXA</h1>
    </div>
    <div style="background:#fff;padding:40px;border-radius:0 0 12px 12px;box-shadow:0 4px 24px rgba(0,0,0,0.06);text-align:center;">
      <div style="font-size:48px;margin-bottom:16px;">✉️</div>
      <h2 style="font-size:22px;color:#1a1a1a;margin:0 0 12px;">Verify Your Email</h2>
      <p style="color:#888;font-size:14px;margin:0 0 32px;">Hi ${name}, please verify your email address to complete your Vérixa account setup.</p>
      <a href="${verificationLink}" style="display:inline-block;background:#1a1a1a;color:#fff;padding:16px 32px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">
        Verify Email Address
      </a>
      <p style="color:#bbb;font-size:12px;margin-top:24px;">This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
    </div>
  </div>
</body>
</html>
  `,

  newsletterConfirmation: (email: string): string => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Welcome to Vérixa — You're Subscribed!</title></head>
<body style="margin:0;padding:0;background:#f9f7f4;font-family:'Georgia',serif;">
  <div style="max-width:580px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;padding:32px;background:#1a1a1a;border-radius:12px 12px 0 0;">
      <h1 style="color:#fff;font-size:28px;letter-spacing:-1px;margin:0;">VÉRIXA</h1>
    </div>
    <div style="background:#fff;padding:40px;border-radius:0 0 12px 12px;box-shadow:0 4px 24px rgba(0,0,0,0.06);text-align:center;">
      <div style="font-size:48px;margin-bottom:16px;">🎉</div>
      <h2 style="font-size:22px;color:#1a1a1a;margin:0 0 12px;">You're In!</h2>
      <p style="color:#888;font-size:14px;margin:0 0 8px;">Welcome to the Vérixa community.</p>
      <p style="color:#888;font-size:13px;margin:0 0 32px;">${email} has been added to our list. Expect exclusive offers, new arrivals, and styling tips.</p>
      <a href="https://verixa.com/#/shop" style="display:inline-block;background:#1a1a1a;color:#fff;padding:16px 32px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">
        Shop Now
      </a>
      <p style="color:#bbb;font-size:11px;margin-top:24px;"><a href="#" style="color:#bbb;">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>
  `,
};

// ── Email sending function (call from a Supabase Edge Function or API route) ─

/**
 * To use Resend:
 *
 *   import { Resend } from 'resend';
 *   const resend = new Resend(process.env.RESEND_API_KEY);
 *
 *   await resend.emails.send({
 *     from: 'Vérixa <orders@verixa.com>',
 *     to: [recipientEmail],
 *     subject: 'Your Vérixa order is confirmed!',
 *     html: templates.orderConfirmation(data),
 *   });
 *
 * To use SendGrid:
 *
 *   import sgMail from '@sendgrid/mail';
 *   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
 *
 *   await sgMail.send({
 *     to: recipientEmail,
 *     from: 'orders@verixa.com',
 *     subject: 'Your Vérixa order is confirmed!',
 *     html: templates.orderConfirmation(data),
 *   });
 *
 * Note: Supabase already sends auth emails (account verification) via its own
 * email templates. You can customize those in the Supabase dashboard under
 * Authentication → Email Templates.
 */

export const emailService = {
  /**
   * Stub: In production, call your backend API route / Supabase Edge Function here.
   */
  sendOrderConfirmation: async (data: OrderConfirmationData): Promise<void> => {
    console.log('[EmailService] Would send order confirmation to:', data.customerEmail);
    console.log('[EmailService] Template preview:', templates.orderConfirmation(data).slice(0, 200));
    // TODO: Call your backend endpoint, e.g.:
    // await fetch('/api/email/order-confirmation', { method: 'POST', body: JSON.stringify(data) });
  },

  sendShippingNotification: async (data: ShippingNotificationData): Promise<void> => {
    console.log('[EmailService] Would send shipping notification to:', data.customerEmail);
    // TODO: Call your backend endpoint
  },

  sendNewsletterConfirmation: async (email: string): Promise<void> => {
    console.log('[EmailService] Would send newsletter confirmation to:', email);
    // TODO: Call your backend endpoint
  },
};
