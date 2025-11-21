import nodemailer from 'nodemailer';

/**
 * Notification Service - Email and SMS notifications
 */

// Email transporter configuration
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * Send email notification
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createEmailTransporter();
    
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
      text,
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send order confirmation email
 */
export const sendOrderConfirmation = async (order, customer) => {
  const subject = `Order Confirmation - ${order.orderNumber}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .item { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
        .total { font-size: 18px; font-weight: bold; margin-top: 20px; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmation</h1>
        </div>
        <div class="content">
          <p>Hi ${customer.firstName || 'Customer'},</p>
          <p>Thank you for your order! We've received your order and will begin processing it shortly.</p>
          
          <div class="order-details">
            <h2>Order Details</h2>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            
            <h3>Items:</h3>
            ${order.items.map(item => `
              <div class="item">
                <p><strong>${item.name}</strong> x ${item.quantity}</p>
                <p>$${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            `).join('')}
            
            <div class="total">
              <p>Total: $${order.total.toFixed(2)}</p>
            </div>
          </div>
          
          <p>We'll send you another email when your order ships.</p>
        </div>
        <div class="footer">
          <p>Thank you for shopping with us!</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail({
    to: customer.email,
    subject,
    html,
    text: `Order Confirmation - ${order.orderNumber}\n\nThank you for your order!`,
  });
};

/**
 * Send shipping confirmation email
 */
export const sendShippingConfirmation = async (order, customer, tracking) => {
  const subject = `Your Order Has Shipped - ${order.orderNumber}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10b981; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .tracking { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
        .tracking-number { font-size: 24px; font-weight: bold; color: #3b82f6; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Order Has Shipped!</h1>
        </div>
        <div class="content">
          <p>Hi ${customer.firstName || 'Customer'},</p>
          <p>Great news! Your order ${order.orderNumber} has been shipped.</p>
          
          <div class="tracking">
            <p>Tracking Number:</p>
            <p class="tracking-number">${tracking.number}</p>
            <p>Carrier: ${tracking.carrier}</p>
            ${tracking.url ? `<a href="${tracking.url}" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">Track Package</a>` : ''}
          </div>
          
          <p>Estimated delivery: ${tracking.estimatedDelivery ? new Date(tracking.estimatedDelivery).toLocaleDateString() : 'TBD'}</p>
        </div>
        <div class="footer">
          <p>Thank you for shopping with us!</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail({
    to: customer.email,
    subject,
    html,
    text: `Your Order Has Shipped - ${order.orderNumber}\n\nTracking: ${tracking.number}`,
  });
};

/**
 * Send abandoned cart reminder email
 */
export const sendAbandonedCartReminder = async (cart, customer) => {
  const subject = 'You left items in your cart!';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f59e0b; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .cta { text-align: center; margin: 20px 0; }
        .cta a { display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Don't Forget Your Items!</h1>
        </div>
        <div class="content">
          <p>Hi ${customer.firstName || 'Customer'},</p>
          <p>You left some great items in your cart. Complete your purchase now!</p>
          
          <div class="cta">
            <a href="${process.env.FRONTEND_URL}/cart">Complete Your Purchase</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail({
    to: customer.email,
    subject,
    html,
    text: 'You left items in your cart! Complete your purchase now.',
  });
};

/**
 * Send SMS notification (requires Twilio or similar service)
 */
export const sendSMS = async ({ to, message }) => {
  // TODO: Implement SMS sending with Twilio
  // This is a placeholder implementation
  console.log(`SMS to ${to}: ${message}`);
  return { success: true, message: 'SMS sent (mock)' };
};

