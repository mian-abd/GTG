import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  StatusBar, 
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { verifyTokenOnly } from '../../utils/tokenService';

const VisitorLoginScreen = () => {
  const navigation = useNavigation();
  const { handleLogin } = useAuth();
  
  const [token, setToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginPress = async () => {
    if (!token) {
      setErrorMessage('Please enter your verification code');
      return;
    }
    
    try {
      setIsLoading(true);
      setErrorMessage('');
      console.log("VisitorLoginScreen: Starting login with token");
      
      // Verify the token by checking the students collection
      const result = await verifyTokenOnly(token);
      
      if (result.success) {
        console.log("VisitorLoginScreen: Token verification successful, fetching user data");
        // Fetch complete student data from Firestore
        const { getDoc, doc } = await import('firebase/firestore');
        const { db } = await import('../../utils/firebaseConfig');
        
        // Get the full student document
        const studentDocRef = doc(db, 'students', result.studentId);
        const studentSnap = await getDoc(studentDocRef);
        
        if (studentSnap.exists()) {
          const studentData = studentSnap.data();
          console.log("VisitorLoginScreen: Student data fetched successfully");
          
          // Directly call handleLogin without the Alert.alert
          handleLogin('visitor', { 
            id: result.studentId,
            email: result.email,
            token: result.token,
            name: studentData.name || '',
            department: studentData.department || 'Student',
            profileImageUrl: studentData.profileImageUrl || null,
            roomAssignment: studentData.roomAssignment || {},
            ...studentData // Include all other student data
          });
        } else {
          console.log("VisitorLoginScreen: Student document not found, using basic data");
          // If full student document doesn't exist, use the basic data we have
          // Directly call handleLogin without the Alert.alert
          handleLogin('visitor', { 
            id: result.studentId,
            email: result.email,
            token: result.token
          });
        }
      } else {
        console.error("VisitorLoginScreen: Token verification failed", result.error);
        setErrorMessage(result.error || 'Invalid verification code');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestNewCode = () => {
    // Navigate to the SendGridTest screen to request a new code
    navigation.navigate('SendGridTest');
  };

  const handleBackPress = () => {
    // Navigate to the RoleSelection screen instead of using goBack()
    navigation.navigate('RoleSelection');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
        <View style={styles.container}>
          <Text style={styles.headerText}>(auth)/visitor-login</Text>
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/depauw_logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
          <Text style={styles.title}>Visitor Login</Text>
          
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#4285F4" />
            </View>
          )}
          
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input}
                placeholder="Verification Code"
                placeholderTextColor="#888"
                keyboardType="number-pad"
                maxLength={6}
                value={token}
                onChangeText={setToken}
              />
            </View>
            
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
            
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={handleLoginPress}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Verifying...' : 'Login'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={handleRequestNewCode}
            >
              <Text style={styles.forgotPasswordText}>Need a verification code?</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.backLink}
              onPress={handleBackPress}
            >
              <Text style={styles.backLinkText}>Back</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsText}>
              Enter your verification code to log in. This is the code that was sent to your email during registration.
            </Text>
          </View>
          
          <Text style={styles.footer}>DePauw University Pre-College Program</Text>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerText: {
    color: '#888',
    fontSize: 12,
    marginBottom: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 16,
    zIndex: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 120,
    height: 120,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  input: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 16,
    color: 'white',
    fontSize: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  errorText: {
    color: '#FF6B6B',
    marginBottom: 16,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    marginTop: 16,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#007BFF',
    fontSize: 14,
  },
  backLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  backLinkText: {
    color: '#888',
    fontSize: 14,
  },
  instructionsContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  instructionsText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  }
});

export default VisitorLoginScreen; 