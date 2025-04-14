// Test script for SendGrid
import { sendEmail } from './emailService';

/**
 * Test the SendGrid email functionality
 * @param {string} recipientEmail - The email address to send the test email to
 * @returns {Promise<Object>} - Result of the email sending attempt
 */
export const testSendGrid = async (recipientEmail) => {
  // Use the provided email or fall back to the default
  const emailToUse = recipientEmail || 'khangaienkhbat_2026@depuaw.edu';

  try {
    console.log('Attempting to send a test email to:', emailToUse);
    
    const result = await sendEmail(
      emailToUse,
      'Test Email from GTG App',
      'This is a test email from the Gateway to Gold app SendGrid integration.',
      '<h1>Hello from Gateway to Gold!</h1><p>This is a test email from the GTG app SendGrid integration.</p>'
    );
    
    if (result.success) {
      console.log('Test email sent successfully!', result);
      return { success: true, message: 'Email sent successfully' };
    } else {
      console.error('Failed to send test email:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Failed to send test email:', error);
    return { success: false, error: error.message };
  }
};

// Uncomment to run the test directly
// testSendGrid(); 