import React, { useState, useEffect } from 'react';
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
  Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

const LoginScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { handleLogin } = useAuth();
  const { role } = route.params || { role: 'visitor' };
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // For demo, let's hardcode some credentials
  const validCredentials = {
    admin: { email: 'admin@depauw.edu', password: 'mortonspeople' },
    mentor: { email: 'mentor@depauw.edu', password: 'mortonspeople' },
    visitor: { email: 'visitor@depauw.edu', password: 'mortonspeople' },
  };

  // Set initial values based on role for demo purposes
  useEffect(() => {
    if (role === 'admin') {
      setEmail('mlanabdullah_2027@depauw.com');
    } else if (role === 'mentor') {
      setEmail('mentor@depauw.edu');
    } else {
      setEmail('visitor@depauw.edu');
    }
  }, [role]);

  const handleLoginPress = () => {
    // For demo, validate against hardcoded credentials
    if (password === 'mortonspeople') {
      handleLogin(role);
    } else {
      setErrorMessage('Invalid credentials. Please try again.');
    }
  };

  const getLoginTitle = () => {
    switch (role) {
      case 'admin':
        return 'Admin Login';
      case 'mentor':
        return 'Mentor Login';
      case 'visitor':
        return 'Visitor Login';
      default:
        return 'Login';
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
        <View style={styles.container}>
          <Text style={styles.headerText}>(auth)/login</Text>
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
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
          
          <Text style={styles.title}>{getLoginTitle()}</Text>
          
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#888"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                  size={24} 
                  color="#888" 
                />
              </TouchableOpacity>
            </View>
            
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
            
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={handleLoginPress}
            >
              <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.forgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.backLink}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backLinkText}>Back</Text>
            </TouchableOpacity>
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
    backgroundColor: '#333',
    borderRadius: 6,
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
    color: '#E74C3C',
    marginBottom: 16,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#F9A826',
    padding: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  forgotPassword: {
    alignItems: 'center',
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: '#F9A826',
    fontSize: 16,
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
    fontSize: 16,
  },
  footer: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
});

export default LoginScreen; 