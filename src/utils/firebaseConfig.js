// Firebase Web SDK Configuration for Expo
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';

import { 
  getFirestore, 
  collection, 
  addDoc,
  getDocs,
  query,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Your Firebase configuration
// This structure will be read from the GoogleService-Info.plist and google-services.json
const firebaseConfig = {
  // These values will be automatically read from your downloaded config files
  // during the build process, so you don't need to hardcode them here
  apiKey: "AIzaSyAPidd0JyfmTXP4skidXaIjQBk78d2sF1o",
  authDomain: "gatewaytogold-1bf66.firebaseapp.com",
  projectId: "gatewaytogold-1bf66",
  storageBucket: "gatewaytogold-1bf66.firebasestorage.app",
  messagingSenderId: "1098642367077",
  appId: "1:1098642367077:android:6e6c5164d642267672dc8c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Authentication functions
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Firestore functions
export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Add document error:', error);
    throw error;
  }
};

export const getDocuments = async (collectionName) => {
  try {
    const q = query(collection(db, collectionName));
    const querySnapshot = await getDocs(q);
    
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return documents;
  } catch (error) {
    console.error('Get documents error:', error);
    throw error;
  }
};

// Advanced Firestore functions
export const getDocumentById = async (collectionName, documentId) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Get document error:', error);
    throw error;
  }
};

export const updateDocument = async (collectionName, documentId, data) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Update document error:', error);
    throw error;
  }
};

export const deleteDocument = async (collectionName, documentId) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Delete document error:', error);
    throw error;
  }
};

export const queryDocuments = async (collectionName, conditions = [], orderByField = null, orderByDirection = 'asc', limitCount = null) => {
  try {
    let q = collection(db, collectionName);
    
    // Add where conditions
    if (conditions.length > 0) {
      conditions.forEach(condition => {
        q = query(q, where(condition.field, condition.operator, condition.value));
      });
    }
    
    // Add orderBy
    if (orderByField) {
      q = query(q, orderBy(orderByField, orderByDirection));
    }
    
    // Add limit
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return documents;
  } catch (error) {
    console.error('Query documents error:', error);
    throw error;
  }
};

// Storage functions
export const uploadFile = async (uri, storagePath) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, blob);
    
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Upload file error:', error);
    throw error;
  }
};

export { app, auth, db, storage };

/* 
To implement Firebase:

1. Install required packages:
   npm install firebase @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore

2. Replace the placeholder values above with actual Firebase config from your Firebase console

3. Initialize Firebase in your app:
   
   import { initializeApp } from 'firebase/app';
   import { firebaseConfig } from './src/utils/firebaseConfig';
   
   const firebaseApp = initializeApp(firebaseConfig);

4. Use Firebase services:
   
   import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
   import { getFirestore, collection, getDocs } from 'firebase/firestore';
   
   const auth = getAuth(firebaseApp);
   const db = getFirestore(firebaseApp);
*/ 