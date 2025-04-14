import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { verifyUserToken } from '../../utils/tokenService';

const VerificationScreen = ({ route, navigation }) => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // If email is passed from previous screen, use it
    if (route.params?.email) {
      setEmail(route.params.email);
    }
  }, [route.params]);
  
  const handleVerification = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    
    if (!token) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }
    
    try {
      setLoading(true);
      
      const result = await verifyUserToken(email, token);
      
      if (result.success) {
        Alert.alert(
          'Success', 
          'Email verified successfully!',
          [
            { 
              text: 'OK', 
              onPress: () => navigation.navigate('Main') // Navigate to Main screen after successful verification
            }
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Verification failed');
      }
    } catch (error) {
      console.error('Error during verification:', error);
      Alert.alert('Error', `Verification failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleResendCode = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    
    // Navigate back to SendGridTest screen with the email pre-filled
    navigation.navigate('SendGridTest', { email });
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Verify Your Email</Text>
          
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#4285F4" />
            </View>
          )}
          
          <View style={styles.formContainer}>
            <Text style={styles.label}>Email Address:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!route.params?.email} // Make it non-editable if email was passed
            />
            
            <Text style={styles.label}>Verification Code:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter verification code"
              value={token}
              onChangeText={setToken}
              keyboardType="number-pad"
              maxLength={6}
            />
            
            <TouchableOpacity
              style={styles.button}
              onPress={handleVerification}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
            
            <Text style={styles.orText}>- OR -</Text>
            
            <TouchableOpacity
              style={[styles.button, styles.resendButton]}
              onPress={handleResendCode}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Resend Code</Text>
            </TouchableOpacity>
            
            <Text style={styles.infoText}>
              A verification code was sent to your email address. 
              Please check your inbox and enter the code above.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4285F4',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
  },
  resendButton: {
    backgroundColor: '#34A853',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 15,
    fontSize: 16,
    color: '#666',
  },
  infoText: {
    marginTop: 20,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  }
});

export default VerificationScreen; 