import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ActivityIndicator,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { testSendGrid } from '../../utils/sendGridTest';
import { sendEmail } from '../../utils/emailService';
import { generateUniqueToken, addUserToDatabase } from '../../utils/tokenService';
import { sendVerificationEmail } from '../../utils/verificationEmailService';

const SendGridTestScreen = () => {
  const [recipientEmail, setRecipientEmail] = useState('khangaienkhbat_2026@depauw.edu');
  const [subject, setSubject] = useState('Test Email from GTG App');
  const [message, setMessage] = useState('This is a test email from the Gateway to Gold app.');
  const [loading, setLoading] = useState(false);

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
      
      // Add user to database
      const dbResult = await addUserToDatabase(recipientEmail, token);
      
      if (!dbResult.success) {
        Alert.alert('Error', `Failed to register user: ${dbResult.error}`);
        return;
      }
      
      // Send verification email
      const emailResult = await sendVerificationEmail(recipientEmail, token);
      
      if (emailResult.success) {
        Alert.alert(
          'Success', 
          `Verification email sent to ${recipientEmail}. ${dbResult.isNewUser ? 'New user registered.' : 'Existing user updated.'}`
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
        
        <View style={styles.formContainer}>
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
            The verification email includes a unique token and adds the user to the database.
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
  }
});

export default SendGridTestScreen; 