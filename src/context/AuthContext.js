import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth provider component
export const AuthProvider = ({ children, value }) => {
  // Use provided value if it exists, otherwise create a local state
  const [userRole, setUserRole] = useState(value?.userRole || null);
  const [userData, setUserData] = useState(value?.userData || null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize auth state from storage
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const storedRole = await AsyncStorage.getItem('userRole');
        const storedUserData = await AsyncStorage.getItem('userData');
        
        if (storedRole) {
          setUserRole(storedRole);
          if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
          }
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAuthState();
  }, []);
  
  // If value prop changes, update our state
  useEffect(() => {
    if (value?.userRole !== undefined) {
      setUserRole(value.userRole);
    }
    if (value?.userData !== undefined) {
      setUserData(value.userData);
    }
  }, [value?.userRole, value?.userData]);
  
  // Login function - sets the user role and optional user data
  const handleLogin = async (role, data = {}) => {
    if (value?.handleLogin) {
      value.handleLogin(role, data);
    } else {
      try {
        await AsyncStorage.setItem('userRole', role);
        setUserRole(role);
        
        if (Object.keys(data).length > 0) {
          await AsyncStorage.setItem('userData', JSON.stringify(data));
          setUserData(data);
        }
      } catch (error) {
        console.error('Error saving auth state:', error);
      }
    }
  };
  
  // Logout function - clears the user role and data
  const handleLogout = async () => {
    if (value?.handleLogout) {
      value.handleLogout();
    } else {
      try {
        await AsyncStorage.removeItem('userRole');
        await AsyncStorage.removeItem('userData');
        setUserRole(null);
        setUserData(null);
      } catch (error) {
        console.error('Error clearing auth state:', error);
      }
    }
  };
  
  // Create the value object for the context
  const contextValue = {
    userRole,
    userData,
    isLoading,
    handleLogin,
    handleLogout,
    isAuthenticated: userRole !== null,
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 