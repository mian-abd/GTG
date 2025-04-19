import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput,
  FlatList,
  SafeAreaView,
  StatusBar,
  Modal,
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';
import XLSX from 'xlsx';
import { addDocument, getDocuments, updateDocument, deleteDocument, db } from '../../utils/firebaseConfig';
import { collection, query, getDocs } from 'firebase/firestore';

const UserManagementScreen = () => {
  const navigation = useNavigation();
  const { handleLogout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // User action states
  const [selectedUser, setSelectedUser] = useState(null);
  const [userActionModalVisible, setUserActionModalVisible] = useState(false);
  const [editUserModalVisible, setEditUserModalVisible] = useState(false);
  
  // Edit user form state
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editRoomNumber, setEditRoomNumber] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  // Set up edit form when a user is selected for editing
  useEffect(() => {
    if (selectedUser && editUserModalVisible) {
      setEditName(selectedUser.name || '');
      setEditEmail(selectedUser.email || '');
      setEditPhone(selectedUser.phone || '');
      setEditAddress(selectedUser.address || '');
      setEditNotes(selectedUser.notes || '');
      setEditRoomNumber(selectedUser.roomNumber || '');
    }
  }, [selectedUser, editUserModalVisible]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const studentsCollection = await getDocuments('students');
      setUsers(studentsCollection);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'Failed to fetch users');
      setIsLoading(false);
    }
  };

  const handleAddUser = () => {
    setAddModalVisible(true);
  };

  const handleUserAction = (user) => {
    setSelectedUser(user);
    setUserActionModalVisible(true);
  };

  const handleEditUser = () => {
    setUserActionModalVisible(false);
    
    // Delay to prevent stuttering when opening the edit modal
    setTimeout(() => {
      // Set form values from selected user
      setEditName(selectedUser.name || '');
      setEditEmail(selectedUser.email || '');
      setEditPhone(selectedUser.phone || '');
      setEditAddress(selectedUser.address || '');
      setEditNotes(selectedUser.notes || '');
      setEditRoomNumber(selectedUser.roomNumber || '');
      
      setEditUserModalVisible(true);
    }, 300);
  };

  const handleDeleteUser = async () => {
    setUserActionModalVisible(false);
    
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete ${selectedUser.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              
              const result = await deleteDocument('students', selectedUser.id);
              
              if (result) {
                // Remove user from local state
                setUsers(users.filter(user => user.id !== selectedUser.id));
                Alert.alert('Success', 'User deleted successfully');
              } else {
                Alert.alert('Error', 'Failed to delete user');
              }
              
              setSelectedUser(null);
              setIsLoading(false);
            } catch (error) {
              console.error('Error deleting user:', error);
              Alert.alert('Error', 'Failed to delete user: ' + error.message);
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleSaveUserChanges = async () => {
    if (!editName.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }
    
    if (!editEmail.trim()) {
      Alert.alert('Error', 'Email is required');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Prepare updated user data
      const updatedUserData = {
        name: editName,
        email: editEmail,
        phone: editPhone,
        address: editAddress,
        notes: editNotes,
        roomNumber: editRoomNumber,
        updatedAt: new Date().toISOString()
      };
      
      // Reset modal state first to prevent UI freezing
      setEditUserModalVisible(false);
      
      // Update the document in Firestore
      const result = await updateDocument('students', selectedUser.id, updatedUserData);
      
      if (result) {
        // Update the user in local state first
        setUsers(prevUsers => prevUsers.map(user => 
          user.id === selectedUser.id ? { ...user, ...updatedUserData } : user
        ));
        
        // Small delay before showing alert
        setTimeout(() => {
          Alert.alert('Success', 'User updated successfully');
          // Reset selected user after alert is closed
          setSelectedUser(null);
        }, 300);
      } else {
        setTimeout(() => {
          Alert.alert('Error', 'Failed to update user');
        }, 300);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setTimeout(() => {
        Alert.alert('Error', 'Failed to update user: ' + error.message);
      }, 300);
    } finally {
      // Always reset loading state
      setIsLoading(false);
    }
  };

  const handleImportExcel = async () => {
    try {
      setIsLoading(true);
      console.log('Starting file selection...');
      
      // Set up a timeout to prevent the UI from being stuck in loading state
      const timeoutId = setTimeout(() => {
        console.log('Document picker timeout - resetting loading state');
        setIsLoading(false);
        Alert.alert(
          'Operation Timed Out', 
          'The file picker took too long to respond. Please try again.'
        );
      }, 10000); // 10 second timeout
      
      // Use a slightly different approach for the document picker
      let result;
      try {
        if (Platform.OS === 'ios') {
          // iOS specific approach
          result = await DocumentPicker.getDocumentAsync({
            type: ['public.comma-separated-values-text', 'public.spreadsheet'],
            copyToCacheDirectory: true
          });
        } else {
          // Android approach
          result = await DocumentPicker.getDocumentAsync({
            type: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'],
            copyToCacheDirectory: true
          });
        }
        
        // Clear the timeout since the picker responded
        clearTimeout(timeoutId);
      } catch (pickerError) {
        clearTimeout(timeoutId);
        console.error('Document picker error:', pickerError);
        Alert.alert('Error', `Could not open file picker: ${pickerError.message}`);
        setIsLoading(false);
        return;
      }

      console.log('Document picker result:', result);

      if (!result || result.canceled) {
        console.log('File selection was canceled or returned null');
        setIsLoading(false);
        return;
      }

      // Get the selected file
      if (!result.assets || result.assets.length === 0) {
        console.log('No file was selected');
        Alert.alert('Error', 'No file was selected');
        setIsLoading(false);
        return;
      }
      
      const file = result.assets[0];
      console.log('Selected file:', file);

      if (!file.uri) {
        console.log('File URI is missing');
        Alert.alert('Error', 'Could not access the selected file');
        setIsLoading(false);
        return;
      }

      // Check if the file is a CSV or Excel file
      const fileType = file.name ? file.name.split('.').pop().toLowerCase() : '';
      console.log('File type:', fileType);
      
      if (fileType === 'csv') {
        // Read the CSV file
        console.log('Reading CSV file...');
        try {
          const fileContent = await FileSystem.readAsStringAsync(file.uri);
          
          // Parse CSV content
          Papa.parse(fileContent, {
            header: true,
            complete: async (results) => {
              console.log('Parsed CSV data:', results.data);
              await processUserData(results.data);
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
          // Read the file as base64
          const base64 = await FileSystem.readAsStringAsync(file.uri, {
            encoding: FileSystem.EncodingType.Base64
          });
          
          console.log('File read as base64, parsing Excel content...');
          // Parse Excel content
          const workbook = XLSX.read(base64, { type: 'base64' });
          
          // Get the first worksheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          console.log('Worksheet loaded, converting to data...');
          
          // Get cell values directly for headers (assuming row 1 has headers)
          const headers = [];
          const range = XLSX.utils.decode_range(worksheet['!ref']);
          
          // Log the range to understand the sheet structure
          console.log('Sheet range:', range);
          
          // For Excel files with data starting at A2 (row 2)
          // We'll process it directly rather than using sheet_to_json
          const userData = [];
          
          // Start from row 2 (index 1) if there are headers in row 1
          for (let row = 1; row <= range.e.r; row++) {
            const firstName = worksheet[XLSX.utils.encode_cell({r: row, c: 0})]?.v || '';
            const lastName = worksheet[XLSX.utils.encode_cell({r: row, c: 1})]?.v || '';
            const email = worksheet[XLSX.utils.encode_cell({r: row, c: 2})]?.v || '';
            const phone = worksheet[XLSX.utils.encode_cell({r: row, c: 3})]?.v || '';
            const address = worksheet[XLSX.utils.encode_cell({r: row, c: 4})]?.v || '';
            const notes = worksheet[XLSX.utils.encode_cell({r: row, c: 5})]?.v || '';
            
            // Skip empty rows
            if (!firstName && !lastName && !email) continue;
            
            // Combine first and last name
            const name = `${firstName} ${lastName}`.trim();
            
            userData.push({
              name,
              email,
              phone,
              address,
              notes
            });
          }
          
          console.log('Processed Excel data:', userData);
          
          // Process the data
          await processUserData(userData);
        } catch (error) {
          console.error('Excel parsing error:', error);
          Alert.alert('Error', `Failed to parse Excel file: ${error.message}`);
          setIsLoading(false);
        }
      } else {
        Alert.alert('Error', 'Unsupported file format. Please use .csv, .xlsx or .xls files.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error importing file:', error);
      Alert.alert('Error', `Failed to import file: ${error.message}`);
      setIsLoading(false);
    }
  };

  const processUserData = async (userData) => {
    try {
      console.log('Processing user data:', userData);
      if (!userData || userData.length === 0) {
        Alert.alert('Error', 'No data found in the file');
        setIsLoading(false);
        return;
      }

      // Check for valid data structure
      let validUsers = [];
      
      for (const user of userData) {
        // Check if we can get name and email (either direct or from first/last name)
        const email = user.email;
        let name = user.name;
        
        // If we don't have a name but have firstName/lastName
        if (!name && (user.firstName || user.lastName)) {
          name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
        }
        
        if (name && email) {
          validUsers.push({
            ...user,
            name,
            email
          });
        }
      }
      
      if (validUsers.length === 0) {
        Alert.alert('Error', 'No valid user data found in the file. Make sure your file has name and email columns.');
        setIsLoading(false);
        return;
      }

      console.log('Valid users found:', validUsers.length);
      
      // Import users to Firebase
      const importedCount = await importUsersToFirebase(validUsers);
      
      // Refresh the user list
      await fetchUsers();
      
      Alert.alert('Success', `Successfully imported ${importedCount} users`);
      setIsLoading(false);
    } catch (error) {
      console.error('Error processing user data:', error);
      Alert.alert('Error', 'Failed to process user data: ' + error.message);
      setIsLoading(false);
    }
  };

  const importUsersToFirebase = async (users) => {
    let importedCount = 0;
    
    try {
      // Get existing emails to prevent duplicates
      const q = query(collection(db, 'students'));
      const querySnapshot = await getDocs(q);
      const existingEmails = {};
      
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.email) {
          existingEmails[userData.email.toLowerCase()] = true;
        }
      });

      // Process each user
      for (const user of users) {
        // Skip if email already exists
        if (existingEmails[user.email.toLowerCase()]) {
          console.log(`Skipping duplicate email: ${user.email}`);
          continue;
        }
        
        // Prepare user data
        const userData = {
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          role: 'student',
          status: 'active',
          // Add any other fields from the CSV
          address: user.address || '',
          notes: user.notes || '',
          roomNumber: user.roomNumber || '',
          // Add timestamps
          importedAt: new Date().toISOString(),
        };
        
        // Add the user to Firestore
        await addDocument('students', userData);
        importedCount++;
      }
      
      return importedCount;
    } catch (error) {
      console.error('Error importing users to Firebase:', error);
      throw error;
    }
  };

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
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => {
                setAddModalVisible(false);
                Alert.alert('Add User', 'Form to add a new user would open here');
              }}
            >
              <Ionicons name="person-add-outline" size={22} color="#333" />
              <Text style={styles.modalOptionText}>Add User Manually</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => {
                setAddModalVisible(false);
                // Add a small delay before opening the picker to ensure the modal is closed
                setTimeout(() => {
                handleImportExcel();
                }, 300);
              }}
            >
              <Ionicons name="document-outline" size={22} color="#333" />
              <Text style={styles.modalOptionText}>Import from Excel</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => {
                setAddModalVisible(false);
                handleImportSampleData();
              }}
            >
              <Ionicons name="people-outline" size={22} color="#333" />
              <Text style={styles.modalOptionText}>Import Sample Data</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // Function to import sample data without needing a file picker
  const handleImportSampleData = async () => {
    try {
      setIsLoading(true);
      console.log('Importing sample data...');

      // Sample data simulating an Excel file with First Name, Last Name, Email format
      const sampleData = [
        {
          name: 'John Smith',
          email: 'john.smith@example.com',
          phone: '555-1234',
          address: '123 Main St',
          roomNumber: '101',
          notes: 'Sample student record'
        },
        {
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          phone: '555-5678',
          address: '456 Oak Ave',
          roomNumber: '102',
          notes: 'Another sample record'
        },
        {
          name: 'Robert Johnson',
          email: 'robert.j@example.com',
          phone: '555-9101',
          address: '789 Pine Blvd',
          roomNumber: '103',
          notes: 'Third sample record'
        },
        {
          name: 'Khangai Enkhbat',
          email: 'khangaienkhbat_2026@depauw.edu',
          phone: '555-2233',
          address: '101 Maple St',
          roomNumber: '104',
          notes: 'Fourth sample record'
        }
      ];

      console.log('Processing sample data:', sampleData);
      await processUserData(sampleData);
    } catch (error) {
      console.error('Error importing sample data:', error);
      Alert.alert('Error', `Failed to import sample data: ${error.message}`);
      setIsLoading(false);
    }
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userDetails}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        {item.phone && <Text style={styles.userPhone}>{item.phone}</Text>}
        {item.roomNumber && <Text style={styles.userPhone}>Room: {item.roomNumber}</Text>}
      </View>
      <TouchableOpacity 
        style={styles.userAction}
        onPress={() => handleUserAction(item)}
      >
        <Ionicons name="ellipsis-vertical" size={20} color="#666" />
      </TouchableOpacity>
    </View>
  );

  // User Action Modal (for edit/delete options)
  const UserActionModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={userActionModalVisible}
      onRequestClose={() => setUserActionModalVisible(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setUserActionModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>User Actions</Text>
            <TouchableOpacity onPress={() => setUserActionModalVisible(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={handleEditUser}
            >
              <Ionicons name="create-outline" size={22} color="#333" />
              <Text style={styles.modalOptionText}>Edit User</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalOption, styles.deleteOption]}
              onPress={handleDeleteUser}
            >
              <Ionicons name="trash-outline" size={22} color="#d32f2f" />
              <Text style={[styles.modalOptionText, styles.deleteText]}>Delete User</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // Edit User Modal
  const EditUserModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={editUserModalVisible}
      onRequestClose={() => setEditUserModalVisible(false)}
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
              <Text style={styles.editModalTitle}>Edit User</Text>
              <TouchableOpacity 
                onPress={() => setEditUserModalVisible(false)}
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
                value={editName}
                onChangeText={setEditName}
                placeholder="Full Name"
                returnKeyType="next"
                blurOnSubmit={false}
              />
              
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.editInput}
                value={editEmail}
                onChangeText={setEditEmail}
                placeholder="Email Address"
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                blurOnSubmit={false}
              />
              
              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput
                style={styles.editInput}
                value={editPhone}
                onChangeText={setEditPhone}
                placeholder="Phone Number"
                keyboardType="phone-pad"
                returnKeyType="next"
                blurOnSubmit={false}
              />
              
              <Text style={styles.inputLabel}>Room Number</Text>
              <TextInput
                style={styles.editInput}
                value={editRoomNumber}
                onChangeText={setEditRoomNumber}
                placeholder="Room Number"
                returnKeyType="next"
                blurOnSubmit={false}
              />
              
              <Text style={styles.inputLabel}>Address</Text>
              <TextInput
                style={styles.editInput}
                value={editAddress}
                onChangeText={setEditAddress}
                placeholder="Address"
                returnKeyType="next"
                blurOnSubmit={false}
              />
              
              <Text style={styles.inputLabel}>Notes</Text>
              <TextInput
                style={[styles.editInput, styles.notesInput]}
                value={editNotes}
                onChangeText={setEditNotes}
                placeholder="Additional Notes"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                blurOnSubmit={true}
              />
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSaveUserChanges}
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <View style={styles.header}>
        <Text style={styles.screenTitle}>User Management</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {isLoading && !users.length ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F9A826" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
      <FlatList
          data={users.filter(user => 
            user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
            user.email?.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          keyExtractor={(item) => item.id || Math.random().toString()}
          renderItem={renderUserItem}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No users found</Text>
            <Text style={styles.emptyText}>
              Users you add or import will appear here.
            </Text>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />
      )}

      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddUser}
        disabled={isLoading}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      <AddOptionModal />
      <UserActionModal />
      <EditUserModal />
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
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: '#666',
  },
  userAction: {
    padding: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#F9A826',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
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
  modalContent: {
    padding: 8,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalOptionText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  deleteOption: {
    borderBottomWidth: 0,
  },
  deleteText: {
    color: '#d32f2f',
  },
  
  // Edit modal styles
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
  keyboardAvoidingContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserManagementScreen; 