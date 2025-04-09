import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput,
  FlatList,
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

const UserManagementScreen = () => {
  const navigation = useNavigation();
  const { handleLogout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);

  const handleMenuToggle = () => {
    // Toggle the sidebar menu
  };

  const handleAddUser = () => {
    // Open add user modal
    Alert.alert('Add User', 'This would open a form to add a new user.');
  };

  const handleImportExcel = () => {
    // Open file picker for Excel import
    Alert.alert('Import Excel', 'This would open a file picker to import users from Excel.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleMenuToggle} style={styles.menuButton}>
            <Ionicons name="menu" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Ionicons name="school" size={24} color="#F9A826" />
            <Text style={styles.headerTitle}>Admin Dashboard</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.pageTitle}>User Management</Text>

          <View style={styles.actionsRow}>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddUser}
            >
              <Ionicons name="add" size={18} color="#FFF" />
              <Text style={styles.buttonText}>Add User</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.importButton}
              onPress={handleImportExcel}
            >
              <Text style={styles.buttonText}>Import Excel</Text>
            </TouchableOpacity>

            <View style={styles.spacer} />
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#AAA" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search users..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={styles.tableContainer}>
            <View style={styles.divider} />
            <Text style={styles.noUsersText}>No users found.</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.paginationContainer}>
            <View style={styles.rowsPerPageContainer}>
              <Text style={styles.rowsPerPageText}>Rows per page:</Text>
              <TouchableOpacity style={styles.rowsSelector}>
                <Text style={styles.rowsValue}>10</Text>
                <Ionicons name="chevron-down" size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  header: {
    backgroundColor: '#1A1A1A',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuButton: {
    marginRight: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  pageTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#F9A826',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  importButton: {
    backgroundColor: '#F9A826',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  spacer: {
    flex: 1,
  },
  searchContainer: {
    backgroundColor: '#333',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    padding: 12,
  },
  tableContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#444',
  },
  noUsersText: {
    color: '#888',
    padding: 24,
    textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 16,
  },
  rowsPerPageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowsPerPageText: {
    color: '#888',
    marginRight: 8,
  },
  rowsSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  rowsValue: {
    color: 'white',
    marginRight: 8,
  },
});

export default UserManagementScreen; 