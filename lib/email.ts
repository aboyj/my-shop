import nodemailer from 'nodemailer';

// Create email transporter (configure with your email service)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'localhost',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: process.env.EMAIL_USER && process.env.EMAIL_PASSWORD
    ? {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      }
    : undefined,
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions) {
  try {
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@myshop.com',
      ...options,
    });

    return result;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

// Email templates
export const emailTemplates = {
  orderConfirmation: (userName: string, orderId: string, total: number) => ({
    subject: 'Order Confirmation - Thank You!',
    html: `
      <h2>Hello ${userName}!</h2>
      <p>Thank you for your purchase. Your order has been confirmed.</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Total Amount:</strong> $${total.toFixed(2)}</p>
      <p>You'll receive a shipping notification soon.</p>
      <p>Best regards,<br>MyShop Team</p>
    `,
  }),

  shippingNotification: (userName: string, orderId: string, trackingUrl?: string) => ({
    subject: 'Your Order Has Shipped!',
    html: `
      <h2>Hello ${userName}!</h2>
      <p>Great news! Your order has shipped.</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      ${trackingUrl ? `<p><a href="${trackingUrl}">Track your package</a></p>` : ''}
      <p>Best regards,<br>MyShop Team</p>
    `,
  }),

  reviewRequest: (userName: string, productTitle: string, productId: string) => ({
    subject: `Tell us what you think about ${productTitle}!`,
    html: `
      <h2>Hello ${userName}!</h2>
      <p>We'd love to hear your feedback about your recent purchase.</p>
      <p><strong>Product:</strong> ${productTitle}</p>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/products/${productId}/reviews">Write a Review</a></p>
      <p>Thank you!<br>MyShop Team</p>
    `,
  }),

  passwordReset: (resetUrl: string) => ({
    subject: 'Reset Your Password',
    html: `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password:</p>
      <p><a href="${resetUrl}">Reset Password</a></p>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  }),

  welcomeEmail: (userName: string) => ({
    subject: 'Welcome to MyShop!',
    html: `
      <h2>Welcome, ${userName}!</h2>
      <p>Thank you for joining MyShop. We're excited to have you.</p>
      <p>Browse our collection of premium digital products designed for creators, designers, and entrepreneurs.</p>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}">Start Shopping</a></p>
      <p>Best regards,<br>MyShop Team</p>
    `,
  }),
};
