import { db } from './firebaseConfig';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';

/**
 * Generate a unique token for user verification
 * @returns {string} A unique token/code
 */
export const generateUniqueToken = () => {
  // Generate a 6-digit verification code
  const token = Math.floor(100000 + Math.random() * 900000).toString();
  return token;
};

/**
 * Add a new user to the database with their email and token
 * @param {string} email - User's email address
 * @param {string} token - Verification token
 * @returns {Promise<object>} Result of the operation
 */
export const addUserToDatabase = async (email, token) => {
  try {
    console.log('Adding user to database:', email);
    const userRef = doc(db, 'users', email);
    
    // Check if user already exists
    const docSnap = await getDoc(userRef);
    
    // Token expiration time (30 minutes from now)
    const tokenExpires = new Date();
    tokenExpires.setMinutes(tokenExpires.getMinutes() + 30);
    
    if (docSnap.exists()) {
      // Update existing user with new token
      await updateDoc(userRef, {
        verificationToken: token,
        tokenCreatedAt: serverTimestamp(),
        tokenExpires: tokenExpires,
        updatedAt: serverTimestamp()
      });
      console.log('User updated with new token');
      return { success: true, isNewUser: false, message: 'User updated with new token' };
    } else {
      // Create new user with token
      await setDoc(userRef, {
        email,
        verificationToken: token,
        tokenCreatedAt: serverTimestamp(),
        tokenExpires: tokenExpires,
        isVerified: false,
        createdAt: serverTimestamp()
      });
      console.log('New user added to database');
      return { success: true, isNewUser: true, message: 'New user added to database' };
    }
  } catch (error) {
    console.error('Error adding user to database:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Verify a user's token
 * @param {string} email - User's email address
 * @param {string} token - Verification token to check
 * @returns {Promise<object>} Result of the verification
 */
export const verifyUserToken = async (email, token) => {
  try {
    console.log('Verifying token for:', email);
    const userRef = doc(db, 'users', email);
    
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) {
      return { success: false, error: 'User not found' };
    }
    
    const userData = docSnap.data();
    
    // Check if token matches
    if (userData.verificationToken !== token) {
      return { success: false, error: 'Invalid token' };
    }
    
    // Check if token is expired
    const tokenExpires = userData.tokenExpires.toDate ? 
      userData.tokenExpires.toDate() : userData.tokenExpires;
      
    if (tokenExpires < new Date()) {
      return { success: false, error: 'Token has expired' };
    }
    
    // Token is valid, mark user as verified
    await updateDoc(userRef, {
      isVerified: true,
      verificationToken: null, // Clear the token after use
      verifiedAt: serverTimestamp()
    });
    
    console.log('User verified successfully');
    return { success: true, message: 'User verified successfully' };
  } catch (error) {
    console.error('Error verifying user token:', error);
    return { success: false, error: error.message };
  }
}; 