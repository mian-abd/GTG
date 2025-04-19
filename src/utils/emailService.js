// SendGrid Email Service for React Native
// This implementation uses fetch instead of Node.js modules

// IMPORTANT: Replace this with your own SendGrid API key
// For security reasons, use environment variables or a secure storage solution
// DO NOT commit your API key to version control
// Either set this value from your environment or use a secure storage solution
// For development, you can set it directly here but remember to remove it before committing
const SENDGRID_API_KEY = 'YOUR_SENDGRID_API_KEY_HERE'; // Replace with your actual API key but NEVER commit it
const SENDGRID_API_URL = 'https://api.sendgrid.com/v3/mail/send';

// IMPORTANT: This email must be verified in your SendGrid account
// Go to https://sendgrid.com/docs/for-developers/sending-email/sender-identity/
const VERIFIED_SENDER_EMAIL = 'gatewaygold2024@gmail.com';

/**
 * Send an email using SendGrid REST API
 * This implementation is compatible with React Native
 * 
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text content
 * @param {string} html - HTML content (optional)
 * @returns {Promise} - SendGrid API response
 */
export const sendEmail = async (to, subject, text, html) => {
  try {
    console.log('Preparing to send email to:', to);
    console.log('Using verified sender:', VERIFIED_SENDER_EMAIL);
    
    const payload = {
      personalizations: [
        {
          to: [{ email: to }],
          subject: subject,
        },
      ],
      from: { 
        email: VERIFIED_SENDER_EMAIL,
        name: 'Gateway to Gold'
      },
      content: [
        {
          type: 'text/plain',
          value: text,
        },
      ],
    };
    
    // Add HTML content if provided
    if (html) {
      payload.content.push({
        type: 'text/html',
        value: html,
      });
    }
    
    console.log('Email payload prepared:', JSON.stringify(payload, null, 2));
    
    try {
      const response = await fetch(SENDGRID_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SENDGRID_API_KEY}`,
        },
        body: JSON.stringify(payload),
      });
      
      const responseData = await response.text();
      const statusCode = response.status;
      
      console.log('SendGrid API response:', statusCode, responseData);
      
      if (statusCode >= 200 && statusCode < 300) {
        console.log('Email sent successfully!');
        return { success: true, status: statusCode };
      } else {
        console.error('SendGrid API error:', statusCode, responseData);
        return { success: false, status: statusCode, error: responseData };
      }
    } catch (networkError) {
      console.error('Network error when calling SendGrid API:', networkError);
      return { success: false, error: networkError.message, type: 'network_error' };
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}; 