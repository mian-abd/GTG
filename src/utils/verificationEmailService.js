import { sendEmail } from './emailService';

/**
 * Send a verification email to a user with their token
 * @param {string} email - User's email address
 * @param {string} token - Verification token
 * @returns {Promise<object>} Result of the email sending process
 */
export const sendVerificationEmail = async (email, token) => {
  try {
    console.log('Sending verification email to:', email);
    console.log('With token:', token);
    
    const subject = 'Verify Your Email - Gateway to Gold';
    const text = `Your verification code is: ${token}\n\nThis code will expire in 30 minutes.\n\nThank you for joining Gateway to Gold!`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h1 style="color: #4285F4; text-align: center;">Gateway to Gold</h1>
        <div style="background-color: #f5f5f5; border-radius: 10px; padding: 20px; margin-top: 20px;">
          <h2 style="color: #333;">Verify Your Email</h2>
          <p>Thank you for registering with Gateway to Gold! Please use the following verification code to complete your registration:</p>
          <div style="background-color: #e8f0fe; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <span style="font-size: 28px; font-weight: bold; letter-spacing: 2px;">${token}</span>
          </div>
          <p>This code will expire in <strong>30 minutes</strong>.</p>
          <p>If you did not request this verification code, please ignore this email.</p>
        </div>
        <div style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">
          <p>© ${new Date().getFullYear()} Gateway to Gold. All rights reserved.</p>
        </div>
      </div>
    `;
    
    const result = await sendEmail(email, subject, text, html);
    
    if (result.success) {
      console.log('Verification email sent successfully!');
      return { success: true, message: 'Verification email sent successfully' };
    } else {
      console.error('Failed to send verification email:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error: error.message };
  }
}; 