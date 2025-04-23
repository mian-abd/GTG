import { db } from './firebaseConfig';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  getDocs,
  query,
  where,
  serverTimestamp 
} from 'firebase/firestore';

/**
 * Generate a unique ID for students, similar to Firestore auto-generated IDs
 * @returns {string} A unique student ID
 */
export const generateUniqueStudentId = () => {
  // Character set similar to Firestore IDs
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  // Length similar to Firestore IDs (20 characters)
  const idLength = 20;
  let id = '';
  
  for (let i = 0; i < idLength; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return id;
};

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
 * Find a student by email
 * @param {string} email - Student's email address
 * @returns {Promise<object|null>} Student object or null if not found
 */
export const findStudentByEmail = async (email) => {
  try {
    const studentsRef = collection(db, 'students');
    const q = query(studentsRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    // Return the first matching student
    const studentDoc = querySnapshot.docs[0];
    return {
      id: studentDoc.id,
      ...studentDoc.data()
    };
  } catch (error) {
    console.error('Error finding student by email:', error);
    return null;
  }
};

/**
 * Find a student by verification token
 * @param {string} token - Verification token
 * @returns {Promise<object|null>} Student object or null if not found
 */
export const findStudentByToken = async (token) => {
  try {
    const studentsRef = collection(db, 'students');
    const q = query(studentsRef, where('verificationToken', '==', token));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('No student found with token:', token);
      return null;
    }
    
    // Return the first matching student
    const studentDoc = querySnapshot.docs[0];
    console.log('Found student with token:', token, studentDoc.id);
    return {
      id: studentDoc.id,
      ...studentDoc.data()
    };
  } catch (error) {
    console.error('Error finding student by token:', error);
    return null;
  }
};

/**
 * Add a new student to the database with their email and token
 * @param {string} email - Student's email address
 * @param {string} token - Verification token
 * @returns {Promise<object>} Result of the operation
 */
export const addUserToDatabase = async (email, token) => {
  try {
    console.log('Processing verification for student:', email);
    
    // Check if student already exists
    const existingStudent = await findStudentByEmail(email);
    
    // Set token to never expire (100 years in the future)
    const tokenExpires = new Date();
    tokenExpires.setFullYear(tokenExpires.getFullYear() + 100);
    
    if (existingStudent) {
      // Update existing student with new token
      const studentRef = doc(db, 'students', existingStudent.id);
      await updateDoc(studentRef, {
        verificationToken: token,
        tokenCreatedAt: serverTimestamp(),
        tokenExpires: tokenExpires,
        updatedAt: serverTimestamp()
      });
      console.log('Student updated with new token');
      return { 
        success: true, 
        isNewUser: false, 
        message: 'Student updated with new token',
        studentId: existingStudent.id
      };
    } else {
      // Create new student with token and unique ID
      const studentId = generateUniqueStudentId();
      const studentRef = doc(db, 'students', studentId);
      
      await setDoc(studentRef, {
        studentId: studentId,
        email,
        name: '', // Can be updated later
        role: 'student',
        status: 'pending',
        verificationToken: token,
        tokenCreatedAt: serverTimestamp(),
        tokenExpires: tokenExpires,
        isVerified: false,
        createdAt: serverTimestamp()
      });
      
      console.log('New student added to database with ID:', studentId);
      return { 
        success: true, 
        isNewUser: true, 
        message: 'New student added to database',
        studentId: studentId
      };
    }
  } catch (error) {
    console.error('Error adding student to database:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Verify a token and update the associated student record
 * @param {string} token - Verification token to check
 * @returns {Promise<object>} Result of the verification
 */
export const verifyTokenOnly = async (token) => {
  try {
    console.log('Verifying token:', token);
    
    // Find student by token
    const student = await findStudentByToken(token);
    
    if (!student) {
      return { success: false, error: 'Invalid verification code' };
    }
    
    // We're no longer checking if the token is expired
    // Tokens are permanent login credentials
    
    // Token is valid, mark student as verified but keep the token
    const studentRef = doc(db, 'students', student.id);
    await updateDoc(studentRef, {
      isVerified: true,
      status: 'active',
      // Don't clear the token: verificationToken: null,
      // Instead, just record when it was used for login
      lastLoginAt: serverTimestamp()
    });
    
    console.log('Student verified successfully, token preserved');
    return { 
      success: true, 
      message: 'Verification successful',
      studentId: student.id,
      email: student.email,
      token: student.verificationToken
    };
  } catch (error) {
    console.error('Error verifying token:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Verify a student's token
 * @param {string} email - Student's email address
 * @param {string} token - Verification token to check
 * @returns {Promise<object>} Result of the verification
 */
export const verifyUserToken = async (email, token) => {
  try {
    console.log('Verifying token for student:', email);
    
    // Find student by email
    const student = await findStudentByEmail(email);
    
    if (!student) {
      return { success: false, error: 'Student not found' };
    }
    
    // Check if token matches
    if (student.verificationToken !== token) {
      return { success: false, error: 'Invalid token' };
    }
    
    // Check if token is expired
    const tokenExpires = student.tokenExpires.toDate ? 
      student.tokenExpires.toDate() : student.tokenExpires;
      
    if (tokenExpires < new Date()) {
      return { success: false, error: 'Token has expired' };
    }
    
    // Token is valid, mark student as verified and update status
    const studentRef = doc(db, 'students', student.id);
    await updateDoc(studentRef, {
      isVerified: true,
      status: 'active',
      verificationToken: null, // Clear the token after use
      verifiedAt: serverTimestamp()
    });
    
    console.log('Student verified successfully');
    return { 
      success: true, 
      message: 'Student verified successfully',
      studentId: student.id
    };
  } catch (error) {
    console.error('Error verifying student token:', error);
    return { success: false, error: error.message };
  }
}; 