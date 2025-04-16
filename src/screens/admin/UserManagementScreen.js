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
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';
import XLSX from 'xlsx';
import { addDocument, getDocuments, db } from '../../utils/firebaseConfig';
import { collection, query, getDocs } from 'firebase/firestore';

const UserManagementScreen = () => {
  const navigation = useNavigation();
  const { handleLogout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const handleImportExcel = async () => {
    try {
      setIsLoading(true);
      
      // Pick document
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'],
        copyToCacheDirectory: true
      });

      if (result.canceled) {
        setIsLoading(false);
        return;
      }

      // Get the selected file
      const file = result.assets[0];
      console.log('Selected file:', file);

      // Check if the file is a CSV or Excel file
      const fileType = file.name.split('.').pop().toLowerCase();
      
      if (fileType === 'csv') {
        // Read the CSV file
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
      } else if (fileType === 'xlsx' || fileType === 'xls') {
        // Handle Excel files
        try {
          // Read the file as base64
          const base64 = await FileSystem.readAsStringAsync(file.uri, {
            encoding: FileSystem.EncodingType.Base64
          });
          
          // Parse Excel content
          const workbook = XLSX.read(base64, { type: 'base64' });
          
          // Get the first worksheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert to JSON
          const excelData = XLSX.utils.sheet_to_json(worksheet);
          console.log('Parsed Excel data:', excelData);
          
          // Process the data
          await processUserData(excelData);
        } catch (error) {
          console.error('Excel parsing error:', error);
          Alert.alert('Error', 'Failed to parse Excel file. Make sure it has the correct format.');
          setIsLoading(false);
        }
      } else {
        Alert.alert('Error', 'Unsupported file format. Please use .csv, .xlsx or .xls files.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error importing file:', error);
      Alert.alert('Error', 'Failed to import file');
      setIsLoading(false);
    }
  };

  const processUserData = async (userData) => {
    try {
      if (!userData || userData.length === 0) {
        Alert.alert('Error', 'No data found in the file');
        setIsLoading(false);
        return;
      }

      // Check if CSV has required fields
      const firstRow = userData[0];
      if (!firstRow.name || !firstRow.email) {
        Alert.alert('Error', 'CSV file must contain "name" and "email" columns');
        setIsLoading(false);
        return;
      }

      // Filter out rows with empty name or email
      const validUsers = userData.filter(user => user.name && user.email);
      
      if (validUsers.length === 0) {
        Alert.alert('Error', 'No valid user data found in the file');
        setIsLoading(false);
        return;
      }

      // Import users to Firebase
      const importedCount = await importUsersToFirebase(validUsers);
      
      // Refresh the user list
      await fetchUsers();
      
      Alert.alert('Success', `Successfully imported ${importedCount} users`);
      setIsLoading(false);
    } catch (error) {
      console.error('Error processing user data:', error);
      Alert.alert('Error', 'Failed to process user data');
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
                handleImportExcel();
              }}
            >
              <Ionicons name="document-outline" size={22} color="#333" />
              <Text style={styles.modalOptionText}>Import from Excel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderUserItem = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userDetails}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        {item.phone && <Text style={styles.userPhone}>{item.phone}</Text>}
      </View>
      <TouchableOpacity style={styles.userAction}>
        <Ionicons name="ellipsis-vertical" size={20} color="#666" />
      </TouchableOpacity>
    </View>
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

      {isLoading ? (
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
});

export default UserManagementScreen; 