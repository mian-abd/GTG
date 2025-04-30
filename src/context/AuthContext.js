import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
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
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Initialize auth state from storage
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const storedRole = await AsyncStorage.getItem('userRole');
        const storedUserData = await AsyncStorage.getItem('userData');
        
        if (storedRole) {
          setUserRole(storedRole);
          setIsAuthenticated(true);
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
  const handleLogin = useCallback(async (role, userData = {}) => {
    try {
      setIsLoading(true);
      console.log("AuthContext: Starting login process for role:", role);
      
      // Create a user object with role and any other data
      const user = {
        ...userData,
        role
      };
      
      // Store user data in state
      setUserRole(role);
      setUserData(user);
      setIsAuthenticated(true);
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('userRole', role);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      
      // Clear any loading/error states
      setIsLoading(false);
      setError(null);
      
      console.log(`AuthContext: Logged in successfully as: ${role}`, user);
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to log in. Please try again.');
      setIsLoading(false);
    }
  }, []);
  
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
        setIsAuthenticated(false);
      } catch (error) {
        console.error('Error clearing auth state:', error);
      }
    }
  };
  
  // Create the value object for the context
  const contextValue = {
    userRole,
    user: userData,
    isLoading,
    handleLogin,
    handleLogout,
    isAuthenticated,
    error,
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 