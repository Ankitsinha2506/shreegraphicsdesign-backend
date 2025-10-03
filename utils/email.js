const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  if (process.env.NODE_ENV === 'production') {
    // Production email configuration (e.g., SendGrid, AWS SES, etc.)
    return nodemailer.createTransporter({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  } else {
    // Development email configuration (Ethereal for testing)
    return nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.EMAIL_USER || 'ethereal.user@ethereal.email',
        pass: process.env.EMAIL_PASS || 'ethereal.pass'
      }
    });
  }
};

// Send email function
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `${process.env.FROM_NAME || 'Shree Graphics Design'} <${process.env.FROM_EMAIL || 'noreply@shreegraphicsdesign.com'}>`,
      to: options.email,
      subject: options.subject,
      html: options.html || options.message,
      text: options.text
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent:', info.messageId);
    
    // In development, log the preview URL
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: process.env.NODE_ENV !== 'production' ? nodemailer.getTestMessageUrl(info) : null
    };
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error('Email could not be sent');
  }
};

// Email templates
const emailTemplates = {
  // Welcome email template
  welcome: (name, loginUrl) => {
    return {
      subject: 'Welcome to Shree Graphics Design!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
            <h1 style="color: #333; margin: 0;">Welcome to Shree Graphics Design!</h1>
          </div>
          <div style="padding: 30px 20px;">
            <h2 style="color: #333;">Hello ${name}!</h2>
            <p style="color: #666; line-height: 1.6;">Thank you for joining Shree Graphics Design. We're excited to help you create amazing designs for your business.</p>
            <p style="color: #666; line-height: 1.6;">Our platform offers:</p>
            <ul style="color: #666; line-height: 1.6;">
              <li>Custom logo designs</li>
              <li>Business cards and brochures</li>
              <li>Web design services</li>
              <li>Professional packaging design</li>
            </ul>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${loginUrl}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Get Started</a>
            </div>
            <p style="color: #666; line-height: 1.6;">If you have any questions, feel free to contact our support team.</p>
          </div>
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
            <p>© 2024 Shree Graphics Design. All rights reserved.</p>
          </div>
        </div>
      `
    };
  },
  
  // Password reset email template
  passwordReset: (name, resetUrl, expiresIn = '1 hour') => {
    return {
      subject: 'Password Reset Request - Shree Graphics Design',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
            <h1 style="color: #333; margin: 0;">Password Reset Request</h1>
          </div>
          <div style="padding: 30px 20px;">
            <h2 style="color: #333;">Hello ${name}!</h2>
            <p style="color: #666; line-height: 1.6;">We received a request to reset your password for your Shree Graphics Design account.</p>
            <p style="color: #666; line-height: 1.6;">Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
            </div>
            <p style="color: #666; line-height: 1.6;">This link will expire in ${expiresIn}. If you didn't request this password reset, please ignore this email.</p>
            <p style="color: #666; line-height: 1.6; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${resetUrl}" style="color: #007bff;">${resetUrl}</a></p>
          </div>
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
            <p>© 2024 Shree Graphics Design. All rights reserved.</p>
          </div>
        </div>
      `
    };
  },
  
  // Order confirmation email template
  orderConfirmation: (name, orderNumber, orderDetails, totalAmount) => {
    return {
      subject: `Order Confirmation #${orderNumber} - Shree Graphics Design`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
            <h1 style="color: #333; margin: 0;">Order Confirmation</h1>
          </div>
          <div style="padding: 30px 20px;">
            <h2 style="color: #333;">Thank you for your order, ${name}!</h2>
            <p style="color: #666; line-height: 1.6;">Your order has been received and is being processed.</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Order Details</h3>
              <p style="color: #666; margin: 5px 0;"><strong>Order Number:</strong> #${orderNumber}</p>
              <p style="color: #666; margin: 5px 0;"><strong>Total Amount:</strong> $${totalAmount}</p>
            </div>
            <p style="color: #666; line-height: 1.6;">We'll send you another email when your order is ready for review.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/orders/${orderNumber}" style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">View Order</a>
            </div>
          </div>
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
            <p>© 2024 Shree Graphics Design. All rights reserved.</p>
          </div>
        </div>
      `
    };
  },
  
  // Order status update email template
  orderStatusUpdate: (name, orderNumber, oldStatus, newStatus, message) => {
    const statusColors = {
      pending: '#ffc107',
      confirmed: '#17a2b8',
      'in-progress': '#007bff',
      review: '#6f42c1',
      revision: '#fd7e14',
      completed: '#28a745',
      cancelled: '#dc3545'
    };
    
    return {
      subject: `Order #${orderNumber} Status Update - ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
            <h1 style="color: #333; margin: 0;">Order Status Update</h1>
          </div>
          <div style="padding: 30px 20px;">
            <h2 style="color: #333;">Hello ${name}!</h2>
            <p style="color: #666; line-height: 1.6;">Your order status has been updated.</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p style="color: #666; margin: 5px 0;"><strong>Order Number:</strong> #${orderNumber}</p>
              <p style="color: #666; margin: 5px 0;"><strong>Previous Status:</strong> <span style="color: ${statusColors[oldStatus] || '#666'}">${oldStatus.charAt(0).toUpperCase() + oldStatus.slice(1)}</span></p>
              <p style="color: #666; margin: 5px 0;"><strong>New Status:</strong> <span style="color: ${statusColors[newStatus] || '#666'}">${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}</span></p>
              ${message ? `<p style="color: #666; margin: 15px 0 5px 0;"><strong>Message:</strong></p><p style="color: #666; margin: 5px 0;">${message}</p>` : ''}
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/orders/${orderNumber}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">View Order</a>
            </div>
          </div>
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
            <p>© 2024 Shree Graphics Design. All rights reserved.</p>
          </div>
        </div>
      `
    };
  }
};

// Send welcome email
const sendWelcomeEmail = async (email, name) => {
  const loginUrl = `${process.env.FRONTEND_URL}/login`;
  const template = emailTemplates.welcome(name, loginUrl);
  
  return await sendEmail({
    email,
    ...template
  });
};

// Send password reset email
const sendPasswordResetEmail = async (email, name, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const template = emailTemplates.passwordReset(name, resetUrl);
  
  return await sendEmail({
    email,
    ...template
  });
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (email, name, orderNumber, orderDetails, totalAmount) => {
  const template = emailTemplates.orderConfirmation(name, orderNumber, orderDetails, totalAmount);
  
  return await sendEmail({
    email,
    ...template
  });
};

// Send order status update email
const sendOrderStatusUpdateEmail = async (email, name, orderNumber, oldStatus, newStatus, message) => {
  const template = emailTemplates.orderStatusUpdate(name, orderNumber, oldStatus, newStatus, message);
  
  return await sendEmail({
    email,
    ...template
  });
};

module.exports = {
  sendEmail,
  emailTemplates,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail
};