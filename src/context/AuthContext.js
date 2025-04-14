import React, { createContext, useState, useContext, useEffect } from 'react';

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
  
  // If value prop changes, update our state
  useEffect(() => {
    if (value?.userRole !== undefined) {
      setUserRole(value.userRole);
    }
  }, [value?.userRole]);
  
  // Login function - sets the user role
  const handleLogin = (role) => {
    if (value?.handleLogin) {
      value.handleLogin(role);
    } else {
      setUserRole(role);
    }
  };
  
  // Logout function - clears the user role
  const handleLogout = () => {
    if (value?.handleLogout) {
      value.handleLogout();
    } else {
      setUserRole(null);
    }
  };
  
  // Create the value object for the context
  const contextValue = {
    userRole: userRole,
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