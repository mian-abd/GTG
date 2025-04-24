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
  ScrollView,
  Switch
} from 'react-native';
import { testSendGrid } from '../../utils/sendGridTest';
import { sendEmail, updateSendGridApiKey } from '../../utils/emailService';
import { generateUniqueToken, addUserToDatabase } from '../../utils/tokenService';
import { sendVerificationEmail } from '../../utils/verificationEmailService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SendGridTestScreen = ({ route, navigation }) => {
  const [recipientEmail, setRecipientEmail] = useState('khangaienkhbat_2026@depauw.edu');
  const [subject, setSubject] = useState('Test Email from GTG App');
  const [message, setMessage] = useState('This is a test email from the Gateway to Gold app.');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [lastUpdateStatus, setLastUpdateStatus] = useState(null);

  // If email is passed from another screen
  useEffect(() => {
    if (route.params?.email) {
      setRecipientEmail(route.params.email);
    }
    
    // Load the current API key from storage
    const loadApiKey = async () => {
      try {
        const storedKey = await AsyncStorage.getItem('SENDGRID_API_KEY');
        if (storedKey) {
          setApiKey(storedKey);
        }
      } catch (error) {
        console.error('Error loading API key:', error);
      }
    };
    
    loadApiKey();
  }, [route.params]);

  const handleUpdateApiKey = async () => {
    if (!apiKey) {
      Alert.alert('Error', 'Please enter an API key');
      return;
    }

    try {
      setLoading(true);
      
      // Update the API key
      const result = await updateSendGridApiKey(apiKey);
      
      if (result.success) {
        setLastUpdateStatus({
          success: true,
          message: 'API key updated successfully!'
        });
        Alert.alert('Success', 'SendGrid API key updated successfully!');
      } else {
        setLastUpdateStatus({
          success: false,
          message: `Failed to update API key: ${result.error}`
        });
        Alert.alert('Error', `Failed to update API key: ${result.error}`);
      }
    } catch (error) {
      console.error('Error updating API key:', error);
      setLastUpdateStatus({
        success: false,
        message: `Error: ${error.message}`
      });
      Alert.alert('Error', `Failed to update API key: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!recipientEmail) {
      Alert.alert('Error', 'Please enter a recipient email address');
      return;
    }

    try {
      setLoading(true);
      
      const result = await sendEmail(
        recipientEmail,
        subject,
        message,
        `<h1>${subject}</h1><p>${message}</p>`
      );
      
      if (result.success) {
        Alert.alert('Success', 'Email sent successfully!');
        console.log('Email result:', result);
      } else {
        Alert.alert('Error', `Failed to send email: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      Alert.alert('Error', `Failed to send email: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSendDefaultTest = async () => {
    if (!recipientEmail) {
      Alert.alert('Error', 'Please enter a recipient email address');
      return;
    }

    try {
      setLoading(true);
      const result = await testSendGrid(recipientEmail);
      
      if (result.success) {
        Alert.alert('Success', 'Test email sent successfully!');
      } else {
        Alert.alert('Error', `Failed to send test email: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending default test email:', error);
      Alert.alert('Error', `Failed to send default test email: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSendVerificationEmail = async () => {
    if (!recipientEmail) {
      Alert.alert('Error', 'Please enter a recipient email address');
      return;
    }

    try {
      setLoading(true);
      
      // Generate a unique token
      const token = generateUniqueToken();
      
      // Add user to database as a student
      const dbResult = await addUserToDatabase(recipientEmail, token);
      
      if (!dbResult.success) {
        Alert.alert('Error', `Failed to register student: ${dbResult.error}`);
        return;
      }
      
      // Send verification email
      const emailResult = await sendVerificationEmail(recipientEmail, token);
      
      if (emailResult.success) {
        Alert.alert(
          'Success', 
          `Verification email sent to ${recipientEmail}.\n\n${dbResult.isNewUser ? 'New student registered' : 'Existing student updated'} with ID: ${dbResult.studentId}`
        );
      } else {
        Alert.alert('Error', `Failed to send verification email: ${emailResult.error}`);
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
      Alert.alert('Error', `Failed to send verification email: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>SendGrid Email Test</Text>
        
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#4285F4" />
          </View>
        )}

        {/* API Key Configuration Section */}
        <View style={styles.formContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>API Key Configuration</Text>
            <TouchableOpacity 
              style={styles.toggleButton}
              onPress={() => setApiKeyVisible(!apiKeyVisible)}
            >
              <Text style={styles.toggleButtonText}>
                {apiKeyVisible ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {apiKeyVisible && (
            <>
              <Text style={styles.label}>SendGrid API Key:</Text>
              <View style={styles.apiKeyContainer}>
                <TextInput
                  style={[styles.input, styles.apiKeyInput]}
                  placeholder="Enter SendGrid API Key"
                  value={apiKey}
                  onChangeText={setApiKey}
                  secureTextEntry={!showApiKey}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowApiKey(!showApiKey)}
                >
                  <Text>{showApiKey ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity
                style={[styles.sendButton, styles.apiKeyButton]}
                onPress={handleUpdateApiKey}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Update API Key</Text>
              </TouchableOpacity>
              
              {lastUpdateStatus && (
                <Text style={[
                  styles.statusText, 
                  lastUpdateStatus.success ? styles.successText : styles.errorText
                ]}>
                  {lastUpdateStatus.message}
                </Text>
              )}
              
              <View style={styles.divider} />
            </>
          )}
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Send Test Email</Text>
          <Text style={styles.label}>Recipient Email:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter recipient email"
            value={recipientEmail}
            onChangeText={setRecipientEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <Text style={styles.label}>Subject:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter email subject"
            value={subject}
            onChangeText={setSubject}
          />
          
          <Text style={styles.label}>Message:</Text>
          <TextInput
            style={[styles.input, styles.messageInput]}
            placeholder="Enter email message"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={5}
          />
          
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendTestEmail}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Send Custom Email</Text>
          </TouchableOpacity>
          
          <Text style={styles.orText}>- OR -</Text>
          
          <TouchableOpacity
            style={[styles.sendButton, styles.defaultButton]}
            onPress={handleSendDefaultTest}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Send Default Test Email</Text>
          </TouchableOpacity>
          
          <Text style={styles.orText}>- OR -</Text>
          
          <TouchableOpacity
            style={[styles.sendButton, styles.verificationButton]}
            onPress={handleSendVerificationEmail}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Send Verification Email</Text>
          </TouchableOpacity>
          
          <Text style={styles.infoText}>
            The verification email includes a unique token and adds the student to the database with a unique ID.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
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
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  toggleButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  toggleButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
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
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  apiKeyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  apiKeyInput: {
    flex: 1,
    marginBottom: 0,
  },
  eyeIcon: {
    padding: 10,
    position: 'absolute',
    right: 5,
  },
  apiKeyButton: {
    backgroundColor: '#673AB7',
  },
  messageInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#4285F4',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  defaultButton: {
    backgroundColor: '#34A853',
  },
  verificationButton: {
    backgroundColor: '#EA4335',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 15,
    color: '#666',
  },
  infoText: {
    marginTop: 15,
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
  },
  statusText: {
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
  },
  successText: {
    color: '#34A853',
  },
  errorText: {
    color: '#EA4335',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },
});

export default SendGridTestScreen; 