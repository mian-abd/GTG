import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StatusBar, 
  SafeAreaView,
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const RoleSelectionScreen = () => {
  const navigation = useNavigation();

  const handleRoleSelect = (role) => {
    navigation.navigate('Login', { role });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerText}>(auth)/role-selection</Text>
        
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/depauw_logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        <Text style={styles.title}>DePauw Pre-College Program</Text>
        <Text style={styles.subtitle}>Please select your role to continue</Text>
        
        <View style={styles.rolesContainer}>
          {/* Administrator Card */}
          <View style={styles.roleCard}>
            <View style={[styles.roleIconContainer, { backgroundColor: '#4A69BD' }]}>
              <Ionicons name="briefcase" size={32} color="#FFF" />
            </View>
            <Text style={styles.roleTitle}>Administrator</Text>
            <Text style={styles.roleDescription}>
              Manage the program, oversee activities, and coordinate with mentors and students.
            </Text>
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={() => handleRoleSelect('admin')}
            >
              <Text style={styles.continueButtonText}>Continue as Admin</Text>
            </TouchableOpacity>
          </View>

          {/* Mentor Card */}
          <View style={styles.roleCard}>
            <View style={[styles.roleIconContainer, { backgroundColor: 'teal' }]}>
              <Ionicons name="school" size={32} color="#FFF" />
            </View>
            <Text style={styles.roleTitle}>Mentor</Text>
            <Text style={styles.roleDescription}>
              Guide students through learning activities, provide feedback, and help build skills.
            </Text>
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={() => handleRoleSelect('mentor')}
            >
              <Text style={styles.continueButtonText}>Continue as Mentor</Text>
            </TouchableOpacity>
          </View>

          {/* Visitor Card */}
          <View style={styles.roleCard}>
            <View style={[styles.roleIconContainer, { backgroundColor: '#E74C3C' }]}>
              <Ionicons name="person" size={32} color="#FFF" />
            </View>
            <Text style={styles.roleTitle}>Visitor</Text>
            <Text style={styles.roleDescription}>
              Explore available resources, connect with mentors, and participate in learning activities.
            </Text>
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={() => handleRoleSelect('visitor')}
            >
              <Text style={styles.continueButtonText}>Continue as Visitor</Text>
            </TouchableOpacity>
          </View>

          {/* Firebase Test Card */}
          <View style={styles.roleCard}>
            <View style={[styles.roleIconContainer, { backgroundColor: '#FF9800' }]}>
              <Ionicons name="flame" size={32} color="#FFF" />
            </View>
            <Text style={styles.roleTitle}>Firebase Test</Text>
            <Text style={styles.roleDescription}>
              Test Firebase authentication, Firestore database, and Storage functionality.
            </Text>
            <TouchableOpacity 
              style={[styles.continueButton, { backgroundColor: '#FF9800' }]}
              onPress={() => navigation.navigate('FirebaseTest')}
            >
              <Text style={styles.continueButtonText}>Test Firebase</Text>
            </TouchableOpacity>
          </View>

          {/* SendGrid Test Card */}
          <View style={styles.roleCard}>
            <View style={[styles.roleIconContainer, { backgroundColor: '#0084FF' }]}>
              <Ionicons name="mail" size={32} color="#FFF" />
            </View>
            <Text style={styles.roleTitle}>SendGrid Test</Text>
            <Text style={styles.roleDescription}>
              Test email sending functionality using SendGrid integration.
            </Text>
            <TouchableOpacity 
              style={[styles.continueButton, { backgroundColor: '#0084FF' }]}
              onPress={() => navigation.navigate('SendGridTest')}
            >
              <Text style={styles.continueButtonText}>Test SendGrid</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.footer}>DePauw University Pre-College Summer Program</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerText: {
    color: '#888',
    fontSize: 12,
    marginBottom: 20,
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 30,
  },
  rolesContainer: {
    width: '100%',
    marginBottom: 20,
  },
  roleCard: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  roleIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    color: '#AAA',
    marginBottom: 16,
    lineHeight: 20,
  },
  continueButton: {
    backgroundColor: '#F9A826',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default RoleSelectionScreen; 