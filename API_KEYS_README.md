# API Keys Setup Instructions

## Important Security Note

Never commit API keys, tokens, or other secrets to version control. The repository is configured to ignore `.env` files, but it's your responsibility to ensure sensitive data remains secure.

## Setting Up SendGrid API Key

### Option 1: Using .env File (Recommended for Development)

1. Install the necessary package:
   ```bash
   npm install react-native-dotenv
   ```

2. Create a file named `.env` in the project root (copy from `.env.example`):
   ```
   SENDGRID_API_KEY=your_actual_sendgrid_key_here
   ```

3. Configure babel.config.js to use the environment variables:
   ```javascript
   module.exports = function(api) {
     api.cache(true);
     return {
       presets: ['babel-preset-expo'],
       plugins: [
         [
           'module:react-native-dotenv',
           {
             moduleName: '@env',
             path: '.env',
             blacklist: null,
             whitelist: null,
             safe: false,
             allowUndefined: true,
           },
         ],
       ],
     };
   };
   ```

4. Use the environment variable in code:
   ```javascript
   import { SENDGRID_API_KEY } from '@env';
   
   // Then in your initialization code:
   await setupSendGridApiKey(SENDGRID_API_KEY);
   ```

### Option 2: Using Runtime Setup

1. Create a secure setup screen in your app where admins can enter the API key.
2. Store the API key securely using AsyncStorage (as implemented) or better yet, react-native-keychain.
3. Use this code to set up the key:

   ```javascript
   import { setupSendGridApiKey } from './src/utils/setupApiKeys';
   
   // When the admin submits the API key:
   await setupSendGridApiKey(apiKeyFromInput);
   ```

## Production Security

For production deployment, consider these more secure approaches:

1. **Environment Variables:** Use environment variables set at build time in your CI/CD pipeline.
2. **Backend Proxy:** Set up a backend service that handles API calls requiring keys, so keys never exist in the client app.
3. **Secure Storage:** Use react-native-keychain to store sensitive information with device-level security.
4. **Key Rotation:** Implement a regular key rotation policy and update your app accordingly.

## Testing API Key Setup

Use the built-in test utility to verify your API key is working correctly:

```javascript
import { testSendGrid } from './src/utils/sendGridTest';

// Test the email sending functionality
const result = await testSendGrid('test@example.com');
console.log(result);
```

## Getting a SendGrid API Key

1. Sign up for a SendGrid account at [sendgrid.com](https://sendgrid.com)
2. Verify your account and create an API key with appropriate permissions
3. Follow SendGrid's sender verification process to verify your sender email address 