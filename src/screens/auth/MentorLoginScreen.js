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
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const MentorLoginScreen = () => {
  const navigation = useNavigation();
  const { handleLogin } = useAuth();
  
  const [verificationCode, setVerificationCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginPress = async () => {
    if (!verificationCode) {
      setErrorMessage('Please enter the verification code');
      return;
    }
    
    try {
      setIsLoading(true);
      setErrorMessage('');
      
      // Check verification code against Firebase
      const db = getFirestore();
      const mentorsRef = collection(db, 'mentors');
      const q = query(mentorsRef, where("verificationToken", "==", verificationCode));
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Found matching verification token
        const mentorDoc = querySnapshot.docs[0];
        const mentorData = mentorDoc.data();
        
        Alert.alert(
          'Success',
          'Login successful!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Pass the mentor details to handleLogin
                handleLogin('mentor', { 
                  id: mentorDoc.id,
                  ...mentorData
                });
              }
            }
          ]
        );
      } else {
        setErrorMessage('Invalid verification code. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackPress = () => {
    // Navigate to the RoleSelection screen
    navigation.navigate('RoleSelection');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
        <View style={styles.container}>
          <Text style={styles.headerText}>(auth)/mentor-login</Text>
          
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
          
          <Text style={styles.title}>Mentor Login</Text>
          
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
                autoCapitalize="none"
                value={verificationCode}
                onChangeText={setVerificationCode}
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
              style={styles.backLink}
              onPress={handleBackPress}
            >
              <Text style={styles.backLinkText}>Back</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsText}>
              Enter your mentor verification code to access the mentor dashboard. If you don't have a verification code, please contact an administrator.
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
  errorText: {
    color: '#FF6B6B',
    marginBottom: 16,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#4285F4',
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
  backLink: {
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#666',
    padding: 12,
    borderRadius: 6,
  },
  backLinkText: {
    color: 'white',
    fontSize: 14,
  },
  instructionsContainer: {
    marginTop: 40,
    padding: 16,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    marginHorizontal: 16,
  },
  instructionsText: {
    color: '#CCC',
    textAlign: 'center',
    fontSize: 14,
  },
  footer: {
    color: '#888',
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 20,
    fontSize: 12,
  }
});

export default MentorLoginScreen; 