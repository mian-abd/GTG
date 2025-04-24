// Setup API Keys
// This file provides documentation and utilities for setting up API keys securely

import { updateSendGridApiKey } from './emailService';

/**
 * The recommended way to set up API keys in development
 * Run this code ONCE on app startup or in a setup screen
 * DO NOT COMMIT your actual API keys to source control
 * 
 * In production, consider using:
 * - Environment variables during build time with a CI/CD system
 * - Secure storage solutions like react-native-keychain
 * - A backend service that provides API keys via secure authentication
 */

/**
 * Set up the SendGrid API key
 * @param {string} apiKey - Your SendGrid API key
 * @returns {Promise<Object>} Result of the setup
 */
export const setupSendGridApiKey = async (apiKey) => {
  if (!apiKey) {
    console.error('API key is required');
    return { success: false, error: 'API key is required' };
  }
  
  try {
    // Save the API key to secure storage
    const result = await updateSendGridApiKey(apiKey);
    
    if (result.success) {
      console.log('SendGrid API key set successfully');
      return { success: true };
    } else {
      console.error('Failed to set SendGrid API key', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Error setting up SendGrid API key:', error);
    return { success: false, error: error.message };
  }
};

/**
 * EXAMPLE USAGE
 * 
 * Import this function in your app's initialization code (e.g., App.js)
 * and call it with your API key:
 * 
 * ```javascript
 * import { setupSendGridApiKey } from './utils/setupApiKeys';
 * 
 * // In your initialization code:
 * useEffect(() => {
 *   const initApiKeys = async () => {
 *     // Get API key from a secure source, not hardcoded
 *     const apiKey = process.env.REACT_APP_SENDGRID_API_KEY; 
 *     await setupSendGridApiKey(apiKey);
 *   };
 *   initApiKeys();
 * }, []);
 * ```
 * 
 * For React Native, consider using react-native-dotenv, or
 * a secure storage solution for API keys.
 */ 