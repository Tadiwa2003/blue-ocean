import nodemailer from 'nodemailer';

// Always use tadiwachoga2003@gmail.com as the concierge email
const CONCIERGE_EMAIL = "tadiwachoga2003@gmail.com";

// Check if email is configured (not using placeholder values)
const emailConfigAvailable =
  process.env.EMAIL_HOST &&
  process.env.EMAIL_PORT &&
  process.env.EMAIL_USER &&
  process.env.EMAIL_PASS &&
  process.env.EMAIL_USER !== 'your-email@gmail.com' &&
  process.env.EMAIL_PASS !== 'your-app-password';

let transporter = null;

if (emailConfigAvailable) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  // Verify transporter configuration
  transporter.verify((error, success) => {
    if (error) {
      console.error('[Email] ❌ Email configuration error:', error.message);
      console.error('[Email] Please check your EMAIL_HOST, EMAIL_PORT, EMAIL_USER, and EMAIL_PASS settings.');
    } else {
      console.log('[Email] ✅ Email transporter configured successfully');
      console.log(`[Email] 📧 Concierge email: ${CONCIERGE_EMAIL}`);
      console.log(`[Email] 📧 From address: ${process.env.EMAIL_FROM || process.env.EMAIL_USER}`);
    }
  });
} else {
  console.warn(
    '[Email] ⚠️⚠️⚠️ WARNING: Email transporter NOT configured!'
  );
  console.warn(
    '[Email] Current values:\n' +
    `[Email]   EMAIL_HOST: ${process.env.EMAIL_HOST || 'NOT SET'}\n` +
    `[Email]   EMAIL_PORT: ${process.env.EMAIL_PORT || 'NOT SET'}\n` +
    `[Email]   EMAIL_USER: ${process.env.EMAIL_USER || 'NOT SET'}\n` +
    `[Email]   EMAIL_PASS: ${process.env.EMAIL_PASS ? '***SET***' : 'NOT SET'}`
  );
  if (process.env.EMAIL_USER === 'your-email@gmail.com' || process.env.EMAIL_PASS === 'your-app-password') {
    console.warn(
      '[Email] ⚠️ You are using PLACEHOLDER values in server/.env!\n' +
      '[Email] Please replace "your-email@gmail.com" and "your-app-password" with actual values.'
    );
  }
  console.warn(
    '[Email] 📝 Update server/.env file with your actual Gmail credentials to enable email notifications.'
  );
}

const formatBookingSummary = (booking) => {
  return [
    `Guest: ${booking.guestName || 'Guest'}`,
    `Email: ${booking.guestEmail || 'N/A'}`,
    booking.guestPhone ? `Phone: ${booking.guestPhone}` : null,
    `Service: ${booking.name}`,
    `Date: ${booking.date} at ${booking.time}`,
    `Total: ${booking.currency || 'USD'} ${booking.totalPrice}`,
    booking.addOns?.length
      ? `Add-ons: ${booking.addOns.map((addOn) => addOn.name).join(', ')}`
      : null,
    booking.notes ? `Notes: ${booking.notes}` : null,
  ]
    .filter(Boolean)
    .join('\n');
};

export const sendBookingNotifications = async (booking) => {
  // Validate booking data
  if (!booking) {
    console.error('[Email] ❌ No booking data provided');
    return;
  }

  console.log('[Email] 📧 Attempting to send booking notifications...');
  console.log('[Email] 📋 Booking details:', {
    id: booking.id || booking._id,
    name: booking.name,
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    guestPhone: booking.guestPhone,
    date: booking.date,
    time: booking.time,
    totalPrice: booking.totalPrice,
    status: booking.status || 'pending',
    conciergeEmail: CONCIERGE_EMAIL,
  });

  // Always use tadiwachoga2003@gmail.com as the concierge email
  const targetConciergeEmail = CONCIERGE_EMAIL;
  console.log('[Email] 📧 Target concierge email:', targetConciergeEmail);

  if (!transporter) {
    console.error(
      '[Email] ❌ CRITICAL: Transporter is not configured!\n' +
      `[Email] Current EMAIL_USER: ${process.env.EMAIL_USER || 'NOT SET'}\n` +
      `[Email] Current EMAIL_PASS: ${process.env.EMAIL_PASS ? '***SET***' : 'NOT SET'}\n` +
      '[Email] To enable emails, update server/.env with:\n' +
      '[Email]   - EMAIL_HOST=smtp.gmail.com\n' +
      '[Email]   - EMAIL_PORT=587\n' +
      '[Email]   - EMAIL_USER=your-actual-email@gmail.com (NOT placeholder)\n' +
      '[Email]   - EMAIL_PASS=your-actual-app-password (NOT placeholder)\n' +
      '[Email] Booking was still created successfully in the database.'
    );
    return;
  }

  const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  const bookingSummary = formatBookingSummary(booking);
  
  console.log('[Email] ✅ Transporter is configured');
  console.log('[Email] 📤 From address:', fromAddress);
  console.log('[Email] 📤 To concierge:', targetConciergeEmail);
  
  // Ensure we have required booking fields
  if (!booking.name || !booking.date || !booking.time) {
    console.error('[Email] ❌ Missing required booking fields:', {
      hasName: !!booking.name,
      hasDate: !!booking.date,
      hasTime: !!booking.time,
    });
    return;
  }
  
  // Concierge notification email
  const conciergeMessage = {
    from: fromAddress,
    to: targetConciergeEmail,
    subject: `New Booking: ${booking.name} (${booking.date})`,
    text: `A new booking has been created:\n\n${bookingSummary}\n\nBooking ID: ${booking.id || 'N/A'}\nStatus: ${booking.status || 'pending'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1da0e6;">New Booking Received</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">${booking.name}</h3>
          <p><strong>Guest:</strong> ${booking.guestName || 'Guest'}</p>
          <p><strong>Email:</strong> ${booking.guestEmail || 'N/A'}</p>
          ${booking.guestPhone ? `<p><strong>Phone:</strong> ${booking.guestPhone}</p>` : ''}
          <p><strong>Date:</strong> ${booking.date} at ${booking.time}</p>
          <p><strong>Duration:</strong> ${booking.duration || 60} minutes</p>
          <p><strong>Total:</strong> ${booking.currency || 'USD'} ${booking.totalPrice}</p>
          ${booking.addOns?.length ? `<p><strong>Add-ons:</strong> ${booking.addOns.map((addOn) => addOn.name).join(', ')}</p>` : ''}
          ${booking.notes ? `<p><strong>Notes:</strong> ${booking.notes}</p>` : ''}
          <p><strong>Booking ID:</strong> ${booking.id || 'N/A'}</p>
          <p><strong>Status:</strong> ${booking.status || 'pending'}</p>
        </div>
        <p style="color: #666; font-size: 12px;">Please confirm this booking within 15 minutes.</p>
      </div>
    `,
  };

  // Guest confirmation email
  const guestMessage = booking.guestEmail ? {
      from: fromAddress,
      to: booking.guestEmail,
    subject: `Booking Confirmation: ${booking.name} - Tana's Beauty Boost`,
    text: `Hi ${booking.guestName || 'there'},\n\nThank you for booking with Tana's Beauty Boost Spa!\n\nHere are your booking details:\n\n${bookingSummary}\n\nOur spa concierge will contact you within 15 minutes to confirm your appointment.\n\nWe look forward to seeing you!\n\nBest regards,\nTana's Beauty Boost Spa Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1da0e6;">Booking Confirmation</h2>
        <p>Hi ${booking.guestName || 'there'},</p>
        <p>Thank you for booking with <strong>Tana's Beauty Boost Spa</strong>!</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">${booking.name}</h3>
          <p><strong>Date:</strong> ${booking.date}</p>
          <p><strong>Time:</strong> ${booking.time}</p>
          <p><strong>Duration:</strong> ${booking.duration || 60} minutes</p>
          <p><strong>Total:</strong> ${booking.currency || 'USD'} ${booking.totalPrice}</p>
          ${booking.addOns?.length ? `<p><strong>Add-ons:</strong> ${booking.addOns.map((addOn) => addOn.name).join(', ')}</p>` : ''}
          ${booking.notes ? `<p><strong>Your Notes:</strong> ${booking.notes}</p>` : ''}
        </div>
        <p><strong>Our spa concierge will contact you within 15 minutes to confirm your appointment.</strong></p>
        <p>If you have any questions, please contact us at:</p>
        <p>📞 Phone: +27 788637252<br>📧 Email: tadiwachoga2003@gmail.com</p>
        <p>We look forward to seeing you!</p>
        <p>Best regards,<br><strong>Tana's Beauty Boost Spa Team</strong></p>
      </div>
    `,
  } : null;

  try {
    console.log('[Email] 📤 Sending concierge email to:', targetConciergeEmail);
    console.log('[Email] 📤 Subject:', conciergeMessage.subject);
    console.log('[Email] 📤 From:', fromAddress);
    
    // Send emails in parallel
    const emailPromises = [
      transporter.sendMail(conciergeMessage).then((info) => {
        console.log(`[Email] ✅✅✅ SUCCESS: Concierge notification sent to: ${targetConciergeEmail}`);
        console.log(`[Email] 📧 Message ID: ${info.messageId}`);
        console.log(`[Email] 📧 Response: ${info.response}`);
        return { type: 'concierge', success: true, email: targetConciergeEmail, messageId: info.messageId };
      }).catch((error) => {
        console.error('[Email] ❌❌❌ FAILED to notify concierge:', error.message);
        console.error('[Email] ❌ Full error:', error);
        if (error.code) console.error('[Email] ❌ Error code:', error.code);
        if (error.response) console.error('[Email] ❌ SMTP response:', error.response);
        if (error.responseCode) console.error('[Email] ❌ Response code:', error.responseCode);
        // Provide helpful error messages
        if (error.code === 'EAUTH') {
          console.error('[Email] ❌ Authentication failed - check EMAIL_USER and EMAIL_PASS in server/.env');
        } else if (error.code === 'ECONNECTION') {
          console.error('[Email] ❌ Connection failed - check EMAIL_HOST and EMAIL_PORT in server/.env');
        } else if (error.code === 'ETIMEDOUT') {
          console.error('[Email] ❌ Connection timeout - check your internet connection and email server settings');
        }
        return { type: 'concierge', success: false, email: targetConciergeEmail, error: error.message };
      })
    ];

    if (guestMessage) {
      console.log('[Email] 📤 Sending guest email to:', booking.guestEmail);
      emailPromises.push(
        transporter.sendMail(guestMessage).then((info) => {
          console.log(`[Email] ✅ Guest confirmation sent to: ${booking.guestEmail}`);
          console.log(`[Email] 📧 Message ID: ${info.messageId}`);
          return { type: 'guest', success: true, email: booking.guestEmail, messageId: info.messageId };
        }).catch((error) => {
          console.error(`[Email] ❌ Failed to send guest confirmation to ${booking.guestEmail}:`, error.message);
          console.error('[Email] ❌ Full error:', error);
          return { type: 'guest', success: false, email: booking.guestEmail, error: error.message };
        })
      );
    }

    const results = await Promise.all(emailPromises);
    
    // Log summary
    const successCount = results.filter(r => r && r.success).length;
    const failCount = results.filter(r => r && !r.success).length;
    
    console.log(`[Email] 📊 Email sending summary: ${successCount} succeeded, ${failCount} failed`);
    
    if (failCount > 0) {
      results.filter(r => r && !r.success).forEach(result => {
        console.error(`[Email] ❌ Failed to send ${result.type} email to ${result.email}: ${result.error}`);
      });
    }
    
    if (successCount > 0) {
      console.log('[Email] ✅✅✅ All booking notifications processed successfully!');
    }
  } catch (error) {
    console.error('[Email] ❌❌❌ CRITICAL ERROR sending booking notifications:', error.message);
    console.error('[Email] ❌ Full error stack:', error.stack);
    // Don't throw - booking is already created, email failure shouldn't break the flow
  }
};

// Send booking confirmation email when booking is confirmed
export const sendBookingConfirmation = async (booking) => {
  // Validate booking data
  if (!booking) {
    console.error('[Email] ❌ No booking data provided for confirmation');
    return;
  }

  // Only send confirmation email if status is "confirmed"
  if (booking.status !== 'confirmed') {
    console.log('[Email] 📧 Booking status is not "confirmed", skipping confirmation email');
    return;
  }

  console.log('[Email] 📧 Sending booking confirmation email...');
  console.log('[Email] 📋 Confirmed booking details:', {
    id: booking.id || booking._id,
    name: booking.name,
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    date: booking.date,
    time: booking.time,
    status: booking.status,
  });

  // Always use tadiwachoga2003@gmail.com as the concierge email
  const targetConciergeEmail = CONCIERGE_EMAIL;

  if (!transporter) {
    console.error(
      '[Email] ❌ CRITICAL: Transporter is not configured!\n' +
      '[Email] Cannot send confirmation email. Update server/.env with email credentials.'
    );
    return;
  }

  const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  const bookingSummary = formatBookingSummary(booking);
  
  // Ensure we have required booking fields
  if (!booking.name || !booking.date || !booking.time) {
    console.error('[Email] ❌ Missing required booking fields for confirmation email');
    return;
  }
  
  // Confirmation email to concierge
  const conciergeConfirmationMessage = {
    from: fromAddress,
    to: targetConciergeEmail,
    subject: `✅ Booking Confirmed: ${booking.name} (${booking.date})`,
    text: `A booking has been confirmed:\n\n${bookingSummary}\n\nBooking ID: ${booking.id || 'N/A'}\nStatus: ${booking.status}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">✅ Booking Confirmed</h2>
        <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4CAF50;">
          <h3 style="margin-top: 0; color: #2e7d32;">${booking.name}</h3>
          <p><strong>Guest:</strong> ${booking.guestName || 'Guest'}</p>
          <p><strong>Email:</strong> ${booking.guestEmail || 'N/A'}</p>
          ${booking.guestPhone ? `<p><strong>Phone:</strong> ${booking.guestPhone}</p>` : ''}
          <p><strong>Date:</strong> ${booking.date} at ${booking.time}</p>
          <p><strong>Duration:</strong> ${booking.duration || 60} minutes</p>
          <p><strong>Total:</strong> ${booking.currency || 'USD'} ${booking.totalPrice}</p>
          ${booking.addOns?.length ? `<p><strong>Add-ons:</strong> ${booking.addOns.map((addOn) => addOn.name).join(', ')}</p>` : ''}
          ${booking.notes ? `<p><strong>Notes:</strong> ${booking.notes}</p>` : ''}
          <p><strong>Booking ID:</strong> ${booking.id || 'N/A'}</p>
          <p><strong>Status:</strong> <span style="color: #4CAF50; font-weight: bold;">${booking.status.toUpperCase()}</span></p>
        </div>
        <p style="color: #666; font-size: 12px;">This booking has been confirmed and is ready for the scheduled appointment.</p>
      </div>
    `,
  };

  // Confirmation email to guest
  const guestConfirmationMessage = booking.guestEmail ? {
    from: fromAddress,
    to: booking.guestEmail,
    subject: `✅ Booking Confirmed: ${booking.name} - Tana's Beauty Boost`,
    text: `Hi ${booking.guestName || 'there'},\n\nGreat news! Your booking with Tana's Beauty Boost Spa has been confirmed.\n\nHere are your confirmed booking details:\n\n${bookingSummary}\n\nWe look forward to seeing you on ${booking.date} at ${booking.time}!\n\nIf you have any questions or need to make changes, please contact us at:\n📞 Phone: +27 788637252\n📧 Email: tadiwachoga2003@gmail.com\n\nBest regards,\nTana's Beauty Boost Spa Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">✅ Booking Confirmed!</h2>
        <p>Hi ${booking.guestName || 'there'},</p>
        <p>Great news! Your booking with <strong>Tana's Beauty Boost Spa</strong> has been confirmed.</p>
        <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4CAF50;">
          <h3 style="margin-top: 0; color: #2e7d32;">${booking.name}</h3>
          <p><strong>Date:</strong> ${booking.date}</p>
          <p><strong>Time:</strong> ${booking.time}</p>
          <p><strong>Duration:</strong> ${booking.duration || 60} minutes</p>
          <p><strong>Total:</strong> ${booking.currency || 'USD'} ${booking.totalPrice}</p>
          ${booking.addOns?.length ? `<p><strong>Add-ons:</strong> ${booking.addOns.map((addOn) => addOn.name).join(', ')}</p>` : ''}
          ${booking.notes ? `<p><strong>Your Notes:</strong> ${booking.notes}</p>` : ''}
          <p><strong>Status:</strong> <span style="color: #4CAF50; font-weight: bold;">CONFIRMED</span></p>
        </div>
        <p><strong>We look forward to seeing you on ${booking.date} at ${booking.time}!</strong></p>
        <p>If you have any questions or need to make changes, please contact us at:</p>
        <p>📞 Phone: +27 788637252<br>📧 Email: tadiwachoga2003@gmail.com</p>
        <p>Best regards,<br><strong>Tana's Beauty Boost Spa Team</strong></p>
      </div>
    `,
  } : null;

  try {
    console.log('[Email] 📤 Sending confirmation email to concierge:', targetConciergeEmail);
    console.log('[Email] 📤 Subject:', conciergeConfirmationMessage.subject);
    
    // Send emails in parallel
    const emailPromises = [
      transporter.sendMail(conciergeConfirmationMessage).then((info) => {
        console.log(`[Email] ✅✅✅ SUCCESS: Confirmation email sent to concierge: ${targetConciergeEmail}`);
        console.log(`[Email] 📧 Message ID: ${info.messageId}`);
        return { type: 'concierge', success: true, email: targetConciergeEmail, messageId: info.messageId };
      }).catch((error) => {
        console.error('[Email] ❌❌❌ FAILED to send confirmation to concierge:', error.message);
        console.error('[Email] ❌ Full error:', error);
        return { type: 'concierge', success: false, email: targetConciergeEmail, error: error.message };
      })
    ];

    if (guestConfirmationMessage) {
      console.log('[Email] 📤 Sending confirmation email to guest:', booking.guestEmail);
      emailPromises.push(
        transporter.sendMail(guestConfirmationMessage).then((info) => {
          console.log(`[Email] ✅ Guest confirmation sent to: ${booking.guestEmail}`);
          console.log(`[Email] 📧 Message ID: ${info.messageId}`);
          return { type: 'guest', success: true, email: booking.guestEmail, messageId: info.messageId };
        }).catch((error) => {
          console.error(`[Email] ❌ Failed to send confirmation to guest ${booking.guestEmail}:`, error.message);
          return { type: 'guest', success: false, email: booking.guestEmail, error: error.message };
        })
      );
    }

    const results = await Promise.all(emailPromises);
    
    // Log summary
    const successCount = results.filter(r => r && r.success).length;
    const failCount = results.filter(r => r && !r.success).length;
    
    console.log(`[Email] 📊 Confirmation email summary: ${successCount} succeeded, ${failCount} failed`);
    
    if (successCount > 0) {
      console.log('[Email] ✅✅✅ All confirmation emails processed successfully!');
    }
  } catch (error) {
    console.error('[Email] ❌❌❌ CRITICAL ERROR sending confirmation emails:', error.message);
    console.error('[Email] ❌ Full error stack:', error.stack);
    // Don't throw - email failure shouldn't break the flow
  }
};

