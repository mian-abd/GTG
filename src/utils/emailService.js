// SendGrid Email Service for React Native
// This implementation uses fetch instead of Node.js modules

// IMPORTANT: Secure API key handling
// For security reasons, use environment variables or a secure storage solution
// DO NOT commit your API key to version control

import AsyncStorage from '@react-native-async-storage/async-storage';

// In production, use a more secure method like react-native-keychain
// This implementation allows for runtime updating of the API key
let API_KEY_CACHE = ''; // Runtime cache

// Function to get the API key
const getSendGridApiKey = async () => {
  // If we have a cached key, use it
  if (API_KEY_CACHE) {
    return API_KEY_CACHE;
  }
  
  try {
    // Try to get from storage first
    const storedKey = await AsyncStorage.getItem('SENDGRID_API_KEY');
    if (storedKey) {
      API_KEY_CACHE = storedKey;
      return storedKey;
    }
    
    // If no stored key, return empty string and warn user
    console.warn('No SendGrid API key found. Please set it using updateSendGridApiKey() function');
    return '';
  } catch (error) {
    console.error('Error getting SendGrid API key:', error);
    return '';
  }
};

// Function to update the API key at runtime
export const updateSendGridApiKey = async (newKey) => {
  try {
    await AsyncStorage.setItem('SENDGRID_API_KEY', newKey);
    API_KEY_CACHE = newKey; // Update the cache
    return { success: true };
  } catch (error) {
    console.error('Error updating SendGrid API key:', error);
    return { success: false, error: error.message };
  }
};

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
    
    // Get the API key (asynchronously)
    const SENDGRID_API_KEY = await getSendGridApiKey();
    
    // Check if API key exists
    if (!SENDGRID_API_KEY) {
      return { 
        success: false, 
        error: 'SendGrid API key not set. Please set it using updateSendGridApiKey() function' 
      };
    }
    
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