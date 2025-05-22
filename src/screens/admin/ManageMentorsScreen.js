import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, StatusBar, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { addDocument, getDocuments, updateDocument, deleteDocument, db } from '../../utils/firebaseConfig';
import { collection, query, getDocs, where } from 'firebase/firestore';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import Papa from 'papaparse';
import XLSX from 'xlsx';
import { generateUniqueToken } from '../../utils/tokenService';

// Import demo data
import { MENTORS } from '../../utils/demoData';

// Create a separate component for the Add Mentor Form to isolate state management
const AddMentorForm = ({ visible, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    biography: '',
    students: []
  });

  // Only one update function for all fields
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  // Reset form when modal closes
  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      department: '',
      biography: '',
      students: []
    });
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.editModalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoidingContainer}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
          enabled={Platform.OS === 'ios'}
        >
          <View style={styles.editModalContainer}>
            <View style={styles.editModalHeader}>
              <Text style={styles.editModalTitle}>Add New Mentor</Text>
              <TouchableOpacity 
                onPress={handleClose}
                hitSlop={{top: 20, right: 20, bottom: 20, left: 20}}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              contentContainerStyle={styles.editModalContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.inputLabel}>Name *</Text>
              <TextInput
                style={styles.editInput}
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
                placeholder="Enter name"
                returnKeyType="next"
                blurOnSubmit={false}
              />
              
              <Text style={styles.inputLabel}>Email *</Text>
              <TextInput
                style={styles.editInput}
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                placeholder="Enter email"
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                blurOnSubmit={false}
              />
              
              <Text style={styles.inputLabel}>Department *</Text>
              <TextInput
                style={styles.editInput}
                value={formData.department}
                onChangeText={(text) => handleInputChange('department', text)}
                placeholder="Enter department"
                returnKeyType="next"
                blurOnSubmit={false}
              />
              
              <Text style={styles.inputLabel}>Biography</Text>
              <TextInput
                style={[styles.editInput, styles.notesInput]}
                value={formData.biography}
                onChangeText={(text) => handleInputChange('biography', text)}
                placeholder="Enter biography"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                blurOnSubmit={true}
              />
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSubmit}
                disabled={isLoading}
                activeOpacity={0.7}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Add Mentor</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

// Create a separate component for the Edit Mentor Form to isolate state management
const EditMentorForm = ({ visible, mentor, onClose, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    biography: '',
  });

  // Initialize form when mentor data changes
  useEffect(() => {
    if (mentor) {
      setFormData({
        name: mentor.name || '',
        email: mentor.email || '',
        department: mentor.department || '',
        biography: mentor.biography || '',
      });
    }
  }, [mentor]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }
    
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Email is required');
      return;
    }
    
    onSave(formData);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.editModalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoidingContainer}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
          enabled={Platform.OS === 'ios'}
        >
          <View style={styles.editModalContainer}>
            <View style={styles.editModalHeader}>
              <Text style={styles.editModalTitle}>Edit Mentor</Text>
              <TouchableOpacity 
                onPress={onClose}
                hitSlop={{top: 20, right: 20, bottom: 20, left: 20}}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              contentContainerStyle={styles.editModalContent}
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.editInput}
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
                placeholder="Full Name"
                returnKeyType="next"
                blurOnSubmit={false}
              />
              
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.editInput}
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                placeholder="Email Address"
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                blurOnSubmit={false}
              />
              
              <Text style={styles.inputLabel}>Department</Text>
              <TextInput
                style={styles.editInput}
                value={formData.department}
                onChangeText={(text) => handleInputChange('department', text)}
                placeholder="Department"
                returnKeyType="next"
                blurOnSubmit={false}
              />
              
              <Text style={styles.inputLabel}>Biography</Text>
              <TextInput
                style={[styles.editInput, styles.notesInput]}
                value={formData.biography}
                onChangeText={(text) => handleInputChange('biography', text)}
                placeholder="Biography"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                blurOnSubmit={true}
              />
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSubmit}
                disabled={isLoading}
                activeOpacity={0.7}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const ManageMentorsScreen = () => {
  const [mentors, setMentors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addFormVisible, setAddFormVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  
  // Fetch mentors from Firebase
  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      setIsLoading(true);
      const fetchedMentors = await getDocuments('mentors');
      if (fetchedMentors && fetchedMentors.length > 0) {
        setMentors(fetchedMentors);
      } else {
        // Fallback to demo data if no data in Firebase
        setMentors(MENTORS);
      }
    } catch (error) {
      console.error('Error fetching mentors:', error);
      // Fallback to demo data
      setMentors(MENTORS);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter mentors based on search
  const filteredMentors = mentors.filter(mentor => 
    mentor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectMentor = (mentor) => {
    if (mentor) {
      setSelectedMentor({...mentor}); // Create a copy instead of a reference
      setModalVisible(true);
    }
  };

  const handleAddMentor = () => {
    setAddModalVisible(true);
  };

  // Open add form with a delay to ensure smooth transition
  const openAddMentorForm = () => {
    setAddModalVisible(false);
    // Use a timeout to ensure the first modal is completely closed
    setTimeout(() => {
      setAddFormVisible(true);
    }, 300);
  };

  // Handle edit mentor
  const handleEditMentor = (mentor) => {
    setSelectedMentor(mentor);
    setModalVisible(false);
    setEditModalVisible(true);
  };

  // Handle save mentor changes
  const handleSaveMentorChanges = async (formData) => {
    try {
      setIsLoading(true);
      
      // Prepare updated mentor data
      const updatedMentorData = {
        ...formData,
        updatedAt: new Date().toISOString()
      };
      
      // Update in Firebase
      await updateDocument('mentors', selectedMentor.id, updatedMentorData);
      
      // Update local state
      setMentors(prev => 
        prev.map(mentor => 
          mentor.id === selectedMentor.id 
            ? { ...mentor, ...updatedMentorData } 
            : mentor
        )
      );
      
      Alert.alert(
        'Success',
        'Mentor updated successfully',
        [{ text: 'OK', onPress: () => setEditModalVisible(false) }]
      );
    } catch (error) {
      console.error('Error updating mentor:', error);
      Alert.alert('Error', 'Failed to update mentor. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Modified to accept form data directly and add token generation
  const handleAddMentorSubmit = async (formData) => {
    // Validate form
    if (!formData.name || !formData.email || !formData.department) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      
      // Close modal first to prevent UI freezing
      setAddFormVisible(false);
      
      // Generate a token for login that never expires
      const token = generateUniqueToken();
      
      // Set token expiration 100 years in the future
      const tokenExpires = new Date();
      tokenExpires.setFullYear(tokenExpires.getFullYear() + 100);
      
      // Add to Firebase with token
      const mentorId = await addDocument('mentors', {
        ...formData,
        verificationToken: token,
        tokenCreatedAt: new Date().toISOString(),
        tokenExpires: tokenExpires,
        isVerified: true,
        status: 'active',
        role: 'mentor',
        createdAt: new Date().toISOString()
      });
      
      // Update local state
      const addedMentor = {
        id: mentorId,
        ...formData,
        verificationToken: token,
        tokenCreatedAt: new Date().toISOString(),
        tokenExpires: tokenExpires,
        isVerified: true,
        status: 'active',
        role: 'mentor',
        createdAt: new Date().toISOString()
      };
      
      setMentors(prev => [...prev, addedMentor]);
      
      // Show success message after small delay
      setTimeout(() => {
        Alert.alert(
          'Success', 
          `Mentor added successfully.\n\nLogin Token: ${token}\n\nPlease share this token with the mentor. They will use it to log in.`
        );
      }, 300);
      
    } catch (error) {
      console.error('Error adding mentor:', error);
      setTimeout(() => {
        Alert.alert('Error', 'Failed to add mentor: ' + error.message);
      }, 300);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to generate login token for existing mentor
  const handleGenerateToken = async (mentor) => {
    try {
      setIsLoading(true);
      setModalVisible(false);
      
      // Generate a token for login that never expires
      const token = generateUniqueToken();
      
      // Set token expiration 100 years in the future
      const tokenExpires = new Date();
      tokenExpires.setFullYear(tokenExpires.getFullYear() + 100);
      
      // Update the document in Firestore
      const result = await updateDocument('mentors', mentor.id, {
        verificationToken: token,
        tokenCreatedAt: new Date().toISOString(),
        tokenExpires: tokenExpires,
        isVerified: true,
        status: 'active',
        updatedAt: new Date().toISOString()
      });
      
      if (result) {
        // Update the mentor in local state
        setMentors(prevMentors => prevMentors.map(m => 
          m.id === mentor.id ? { 
            ...m, 
            verificationToken: token,
            tokenCreatedAt: new Date().toISOString(),
            tokenExpires: tokenExpires,
            isVerified: true,
            status: 'active' 
          } : m
        ));
        
        // Show token to admin
        setTimeout(() => {
          Alert.alert(
            'Login Token Generated', 
            `Token for ${mentor.name}: ${token}\n\nPlease share this token with the mentor. They will use it to log in.`
          );
        }, 300);
      } else {
        setTimeout(() => {
          Alert.alert('Error', 'Failed to generate token');
        }, 300);
      }
    } catch (error) {
      console.error('Error generating token:', error);
      setTimeout(() => {
        Alert.alert('Error', 'Failed to generate token: ' + error.message);
      }, 300);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to import sample data without needing a file picker
  const handleImportSampleData = async () => {
    try {
      setIsLoading(true);
      console.log('Importing sample mentor data...');

      // Sample data for mentors
      const sampleData = [
        {
          name: 'Dr. Sarah Reynolds',
          email: 'sarah.reynolds@example.com',
          department: 'Computer Science',
          biography: 'PhD in Computer Science with 15 years of industry experience. Specializes in artificial intelligence and machine learning.',
          students: []
        },
        {
          name: 'Prof. Michael Chen',
          email: 'michael.chen@example.com',
          department: 'Electrical Engineering',
          biography: 'Leading researcher in embedded systems and IoT technologies. Has published over 50 papers in top journals.',
          students: []
        },
        {
          name: 'Dr. Lisa Johnson',
          email: 'lisa.johnson@example.com',
          department: 'Business Administration',
          biography: 'Former CEO with extensive experience in startups and venture capital. Mentors students interested in entrepreneurship.',
          students: []
        },
        {
          name: 'Prof. James Wilson',
          email: 'james.wilson@example.com',
          department: 'Mathematics',
          biography: 'Specializes in applied mathematics and statistical analysis. Helps students develop strong analytical skills.',
          students: []
        }
      ];

      console.log('Processing sample mentor data:', sampleData);
      
      let importedCount = 0;
      
      // Get existing emails to prevent duplicates
      const existingMentors = await getDocuments('mentors');
      const existingEmails = {};
      
      existingMentors.forEach((mentor) => {
        if (mentor.email) {
          existingEmails[mentor.email.toLowerCase()] = true;
        }
      });
      
      // Add each mentor to the database
      for (const mentor of sampleData) {
        // Skip if email already exists
        if (existingEmails[mentor.email.toLowerCase()]) {
          console.log(`Skipping duplicate email: ${mentor.email}`);
          continue;
        }
        
        // Prepare mentor data with timestamps
        const mentorData = {
          ...mentor,
          role: 'mentor',
          status: 'active',
          createdAt: new Date().toISOString(),
        };
        
        // Add to Firestore
        const mentorId = await addDocument('mentors', mentorData);
        console.log(`Added mentor with ID: ${mentorId}`);
        
        // Add to local state with the new ID
        setMentors(prev => [...prev, { ...mentorData, id: mentorId }]);
        
        importedCount++;
      }
      
      // Show success message
      Alert.alert('Success', `Successfully imported ${importedCount} mentors`);
      
    } catch (error) {
      console.error('Error importing sample mentor data:', error);
      Alert.alert('Error', `Failed to import sample mentors: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportExcel = async () => {
    try {
      setIsLoading(true);
      console.log('Starting file selection for mentors...');
      
      // Request media library permissions first (needed for iOS)
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Media library permission denied');
        Alert.alert('Permission Denied', 'We need access to your files to upload Excel sheets.');
        setIsLoading(false);
        return;
      }
      
      try {
        // For iOS, simplify the picker to avoid potential issues
        console.log('Opening document picker...');
        
        // Show an alert to make it clear to the user that we're opening the file picker
        // This also helps ensure the app is properly in the foreground on iOS
        if (Platform.OS === 'ios') {
          Alert.alert(
            'Select File', 
            'The file picker will open now. Please select an Excel or CSV file.',
            [
              { 
                text: 'OK', 
                onPress: async () => {
                  // Wait a moment to ensure the alert is dismissed
                  setTimeout(async () => {
                    try {
                      // Simple approach, avoid complex options that might be causing issues
                      const result = await DocumentPicker.getDocumentAsync({
                        // On iOS, UTI types work better than MIME types
                        type: '*/*' // Allow all files on iOS to ensure it works, we'll filter later
                      });
                      handlePickerResult(result);
                    } catch (error) {
                      console.error('Error in document picker:', error);
                      Alert.alert('Error', 'Failed to open document picker.');
                      setIsLoading(false);
                    }
                  }, 300);
                }
              },
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => setIsLoading(false)
              }
            ]
          );
          return; // Exit early, the picker will be opened from the alert
        }
        
        // For Android, continue with the normal approach
        // Simple approach, avoid complex options that might be causing issues
        const result = await DocumentPicker.getDocumentAsync({
          // On iOS, UTI types work better than MIME types
          type: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv']
        });
        
        handlePickerResult(result);
      } catch (pickerError) {
        console.error('Document picker error:', pickerError);
        Alert.alert('Error', `Could not open file picker: ${pickerError.message}`);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error importing file:', error);
      Alert.alert('Error', `Failed to import file: ${error.message}`);
      setIsLoading(false);
    }
  };

  // Helper function to handle picker result
  const handlePickerResult = async (result) => {
    console.log('Document picker result:', JSON.stringify(result));

    if (result.canceled || !result.assets || result.assets.length === 0) {
      console.log('File selection was canceled or returned no assets');
      setIsLoading(false);
      return;
    }

    const file = result.assets[0];
    console.log('Selected file:', JSON.stringify(file));

    // Process the file
    if (!file.uri) {
      Alert.alert('Error', 'Could not access the selected file');
      setIsLoading(false);
      return;
    }

    // Extract file extension
    const fileType = file.name ? file.name.split('.').pop().toLowerCase() : '';
    console.log('File type:', fileType);
    
    // Since we accepted all file types on iOS, we need to filter by extension here
    const validFileTypes = ['csv', 'xlsx', 'xls'];
    if (!validFileTypes.includes(fileType)) {
      Alert.alert('Error', 'Unsupported file format. Please use .csv, .xlsx or .xls files.');
      setIsLoading(false);
      return;
    }
    
    if (fileType === 'csv') {
      // Handle CSV files
      try {
        const fileContent = await FileSystem.readAsStringAsync(file.uri);
        Papa.parse(fileContent, {
          header: true,
          complete: async (results) => {
            console.log('Parsed CSV data rows:', results.data.length);
            await processMentorData(results.data);
          },
          error: (error) => {
            console.error('CSV parsing error:', error);
            Alert.alert('Error', 'Failed to parse CSV file');
            setIsLoading(false);
          }
        });
      } catch (readError) {
        console.error('Error reading CSV file:', readError);
        Alert.alert('Error', `Failed to read CSV file: ${readError.message}`);
        setIsLoading(false);
      }
    } else if (fileType === 'xlsx' || fileType === 'xls') {
      // Handle Excel files
      try {
        console.log('Reading Excel file...');
        const base64 = await FileSystem.readAsStringAsync(file.uri, {
          encoding: FileSystem.EncodingType.Base64
        });
        
        console.log('File converted to base64, length:', base64.length);
        
        const workbook = XLSX.read(base64, { type: 'base64' });
        console.log('Workbook sheets:', workbook.SheetNames);
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON with headers
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        console.log('Parsed Excel data rows:', data.length);
        
        if (!data || data.length <= 1) {
          Alert.alert('Error', 'No valid data found in the Excel file');
          setIsLoading(false);
          return;
        }
        
        // Get headers from first row
        const headers = data[0];
        console.log('Headers:', headers);
        
        // Map data to object with headers as keys
        const mentorData = [];
        for (let i = 1; i < data.length; i++) {
          const row = data[i];
          if (row.length === 0) continue; // Skip empty rows
          
          const mentor = {};
          for (let j = 0; j < headers.length; j++) {
            mentor[headers[j]] = row[j] || '';
          }
          
          // Create name from first and last name if available
          if (!mentor.name && (mentor.firstName || mentor.lastName || mentor['First Name'] || mentor['Last Name'])) {
            const firstName = mentor.firstName || mentor['First Name'] || '';
            const lastName = mentor.lastName || mentor['Last Name'] || '';
            mentor.name = `${firstName} ${lastName}`.trim();
          }
          
          mentorData.push(mentor);
        }
        
        console.log('Processed mentor data objects:', mentorData.length);
        await processMentorData(mentorData);
      } catch (error) {
        console.error('Excel parsing error:', error);
        Alert.alert('Error', `Failed to parse Excel file: ${error.message}`);
        setIsLoading(false);
      }
    }
  };

  const processMentorData = async (mentorData) => {
    try {
      console.log('Processing mentor data:', mentorData);
      if (!mentorData || mentorData.length === 0) {
        Alert.alert('Error', 'No data found in the file');
        setIsLoading(false);
        return;
      }

      // Check for valid data structure
      let validMentors = [];
      
      for (const mentor of mentorData) {
        // Check if we can get name and email
        const email = mentor.email;
        let name = mentor.name;
        
        // If we don't have a name but have firstName/lastName
        if (!name && (mentor.firstName || mentor.lastName)) {
          name = `${mentor.firstName || ''} ${mentor.lastName || ''}`.trim();
        }
        
        if (name && email) {
          validMentors.push({
            ...mentor,
            name,
            email,
            department: mentor.department || '',
            biography: mentor.biography || ''
          });
        }
      }
      
      if (validMentors.length === 0) {
        Alert.alert('Error', 'No valid mentor data found in the file. Make sure your file has name and email columns.');
        setIsLoading(false);
        return;
      }

      console.log('Valid mentors found:', validMentors.length);
      
      try {
        // Import mentors to Firebase
        const importedCount = await importMentorsToFirebase(validMentors);
        
        // Refresh the mentor list
        await fetchMentors();
        
        Alert.alert('Success', `Successfully imported ${importedCount} mentors`);
      } catch (importError) {
        console.error('Error during import to Firebase:', importError);
        Alert.alert('Error', `Failed to import mentors: ${importError.message}`);
      } finally {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error processing mentor data:', error);
      Alert.alert('Error', 'Failed to process mentor data: ' + error.message);
      setIsLoading(false);
    }
  };

  const importMentorsToFirebase = async (mentors) => {
    let importedCount = 0;
    
    try {
      // Get existing emails to prevent duplicates
      console.log('Fetching existing mentors to check for duplicates...');
      const q = query(collection(db, 'mentors'));
      const querySnapshot = await getDocs(q);
      const existingEmails = {};
      
      querySnapshot.forEach((doc) => {
        const mentorData = doc.data();
        if (mentorData.email) {
          existingEmails[mentorData.email.toLowerCase()] = true;
        }
      });
      
      console.log(`Found ${Object.keys(existingEmails).length} existing mentors`);

      // Process each mentor
      console.log(`Starting import of ${mentors.length} mentors...`);
      for (const mentor of mentors) {
        // Skip if email already exists
        if (existingEmails[mentor.email.toLowerCase()]) {
          console.log(`Skipping duplicate email: ${mentor.email}`);
          continue;
        }
        
        // Generate a token automatically for login
        const token = generateUniqueToken();
        
        // Set token expiration 100 years in the future
        const tokenExpires = new Date();
        tokenExpires.setFullYear(tokenExpires.getFullYear() + 100);
        
        // Prepare mentor data with token
        const mentorData = {
          name: mentor.name,
          email: mentor.email,
          department: mentor.department || '',
          biography: mentor.biography || '',
          role: 'mentor',
          status: 'active',
          students: [],
          createdAt: new Date().toISOString(),
          // Add token fields
          verificationToken: token,
          tokenCreatedAt: new Date().toISOString(),
          tokenExpires: tokenExpires.toISOString(),
          isVerified: true
        };
        
        try {
          // Add the mentor to Firestore
          console.log(`Adding mentor: ${mentor.name} with token: ${token}`);
          await addDocument('mentors', mentorData);
          importedCount++;
          console.log(`Successfully added mentor: ${mentor.name}`);
        } catch (addError) {
          console.error(`Error adding individual mentor ${mentor.name}:`, addError);
          // Continue with next mentor instead of failing the whole batch
        }
      }
      
      console.log(`Successfully imported ${importedCount} mentors`);
      return importedCount;
    } catch (error) {
      console.error('Error importing mentors to Firebase:', error);
      throw error;
    }
  };

  // Function to handle mentor deletion
  const handleDeleteMentor = async (mentor) => {
    if (!mentor || !mentor.id) {
      Alert.alert('Error', 'Invalid mentor data');
      return;
    }

    Alert.alert(
      'Delete Mentor',
      `Are you sure you want to delete ${mentor.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              setModalVisible(false);
              
              // Delete from Firebase
              const success = await deleteDocument('mentors', mentor.id);
              
              if (success) {
                // Update local state
                setMentors(prev => prev.filter(m => m.id !== mentor.id));
                
                // Show success message
                setTimeout(() => {
                  Alert.alert('Success', `${mentor.name} has been deleted`);
                }, 500);
              } else {
                setTimeout(() => {
                  Alert.alert('Error', 'Failed to delete mentor');
                }, 500);
              }
            } catch (error) {
              console.error('Error deleting mentor:', error);
              setTimeout(() => {
                Alert.alert('Error', `Failed to delete mentor: ${error.message}`);
              }, 500);
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  // Add Option Modal
  const AddOptionModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={addModalVisible}
      onRequestClose={() => setAddModalVisible(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setAddModalVisible(false)}
      >
        <View style={styles.addModalContainer}>
          <View style={styles.addModalContent}>
            <TouchableOpacity 
              style={styles.addModalOption}
              onPress={openAddMentorForm}
            >
              <Ionicons name="person-add-outline" size={22} color="#333" />
              <Text style={styles.addModalOptionText}>Add Mentor Manually</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.addModalOption}
              onPress={() => {
                setAddModalVisible(false);
                // Add a longer delay before opening the picker to ensure the modal is completely closed
                setTimeout(() => {
                  // On iOS, we need to ensure we're on the main thread when showing the picker
                  Platform.OS === 'ios' 
                    ? setTimeout(() => { handleImportExcel(); }, 300) 
                    : handleImportExcel();
                }, 500);
              }}
            >
              <Ionicons name="document-outline" size={22} color="#333" />
              <Text style={styles.addModalOptionText}>Import from Excel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.addModalOption}
              onPress={() => {
                setAddModalVisible(false);
                handleImportSampleData();
              }}
            >
              <Ionicons name="people-outline" size={22} color="#333" />
              <Text style={styles.addModalOptionText}>Import Sample Data</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const MentorDetailModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
        setTimeout(() => setSelectedMentor(null), 100);
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedMentor?.name || ''}</Text>
            <TouchableOpacity 
              onPress={() => {
                setModalVisible(false);
                setTimeout(() => setSelectedMentor(null), 100);
              }}
              hitSlop={{top: 20, right: 20, bottom: 20, left: 20}}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
          
          <ScrollView>
            {selectedMentor && (
              <>
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Mentor ID</Text>
                  <Text style={styles.detailItem}>{selectedMentor.id}</Text>
                </View>
                
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Contact Information</Text>
                  <Text style={styles.detailItem}>Email: {selectedMentor.email}</Text>
                  <Text style={styles.detailItem}>Department: {selectedMentor.department}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Biography</Text>
                  <Text style={styles.detailItem}>{selectedMentor.biography || 'No biography provided'}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Students</Text>
                  {selectedMentor.students && selectedMentor.students.length > 0 ? (
                    selectedMentor.students.map((studentId, index) => (
                      <Text key={index} style={styles.detailItem}>• Student ID: {studentId}</Text>
                    ))
                  ) : (
                    <Text style={styles.detailItem}>No students assigned</Text>
                  )}
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Account Information</Text>
                  <Text style={styles.detailItem}>Role: {selectedMentor.role || 'mentor'}</Text>
                  <Text style={styles.detailItem}>Status: {selectedMentor.status || 'active'}</Text>
                  {selectedMentor.createdAt && (
                    <Text style={styles.detailItem}>
                      Created: {new Date(selectedMentor.createdAt).toLocaleDateString()}
                    </Text>
                  )}
                  {selectedMentor.updatedAt && (
                    <Text style={styles.detailItem}>
                      Last Updated: {new Date(selectedMentor.updatedAt).toLocaleDateString()}
                    </Text>
                  )}
                  {selectedMentor.verificationToken && (
                    <Text style={styles.detailItem}>
                      Has Login Token: Yes
                    </Text>
                  )}
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => handleEditMentor(selectedMentor)}
                  >
                    <Ionicons name="create-outline" size={18} color="white" />
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.tokenButton]}
                    onPress={() => handleGenerateToken(selectedMentor)}
                  >
                    <Ionicons name="key-outline" size={18} color="white" />
                    <Text style={styles.buttonText}>Generate Token</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteMentor(selectedMentor)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={18} color="white" />
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderMentorItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.mentorCard}
      onPress={() => handleSelectMentor(item)}
    >
      <View style={styles.mentorInfo}>
        <Text style={styles.mentorName}>{item.name}</Text>
        <View style={styles.mentorDetails}>
        <Text style={styles.mentorEmail}>{item.email}</Text>
        <Text style={styles.mentorDepartment}>{item.department}</Text>
          <Text style={styles.mentorId}>ID: {item.id}</Text>
        <Text style={styles.studentCount}>
            Students: {item.students ? item.students.length : 0}
          </Text>
        </View>
      </View>
      <View style={styles.mentorStatus}>
        <Text style={[styles.statusBadge, item.status === 'active' ? styles.activeBadge : styles.inactiveBadge]}>
          {item.status || 'active'}
        </Text>
        <Ionicons name="chevron-forward" size={24} color="gray" style={styles.chevron} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Manage Mentors</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search mentors..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {isLoading && !mentors.length ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F9A826" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
      <FlatList
        data={filteredMentors}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMentorItem}
        contentContainerStyle={styles.listContainer}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={64} color="#ccc" />
              <Text style={styles.emptyTitle}>No mentors found</Text>
              <Text style={styles.emptyText}>
                Mentors you add or import will appear here.
              </Text>
            </View>
          )}
        />
      )}

      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddMentor}
        disabled={isLoading}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      {/* Loading overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Processing...</Text>
        </View>
      )}

      <AddOptionModal />
      <MentorDetailModal />
      <AddMentorForm 
        visible={addFormVisible} 
        onClose={() => setAddFormVisible(false)} 
        onSubmit={handleAddMentorSubmit}
        isLoading={isLoading}
      />
      <EditMentorForm
        visible={editModalVisible}
        mentor={selectedMentor}
        onClose={() => setEditModalVisible(false)}
        onSave={handleSaveMentorChanges}
        isLoading={isLoading}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  mentorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mentorInfo: {
    flex: 1,
  },
  mentorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  mentorDetails: {
    flexDirection: 'column',
  },
  mentorEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  mentorDepartment: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  mentorId: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  studentCount: {
    fontSize: 14,
    color: '#4a6ea9',
    fontWeight: '500',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'goldenrod',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  detailSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 8,
  },
  detailItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'column',
    marginTop: 20,
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: '#4a6ea9',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addModalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addModalContent: {
    padding: 8,
  },
  addModalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  addModalOptionText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#4a6ea9',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editModalContainer: {
    width: '90%',
    maxHeight: Platform.OS === 'ios' ? '80%' : '90%',
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  keyboardAvoidingContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  editModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  editModalContent: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#4285F4',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mentorStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    padding: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginRight: 8,
  },
  activeBadge: {
    backgroundColor: '#4caf50',
    color: 'white',
  },
  inactiveBadge: {
    backgroundColor: '#f44336',
    color: 'white',
  },
  chevron: {
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  tokenButton: {
    backgroundColor: '#ff9800', // Orange color for the token button
  },
});

export default ManageMentorsScreen; 