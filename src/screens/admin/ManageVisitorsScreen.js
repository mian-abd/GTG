import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Import Firebase functions
import { getDocuments, updateDocument, deleteDocument } from '../../utils/firebaseConfig';

// Import demo data
import { STUDENTS } from '../../utils/demoData';

const ManageVisitorsScreen = () => {
  const [visitors, setVisitors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Fetch visitors from Firebase
  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const fetchedVisitors = await getDocuments('visitors');
      if (fetchedVisitors && fetchedVisitors.length > 0) {
        setVisitors(fetchedVisitors);
      } else {
        // Fallback to demo data if no data in Firebase
        setVisitors(STUDENTS);
      }
    } catch (error) {
      console.error('Error fetching visitors:', error);
      // Fallback to demo data
      setVisitors(STUDENTS);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit visitor
  const handleEditVisitor = (visitor) => {
    // Navigate to edit form or show edit modal
    console.log('Edit visitor:', visitor);
    Alert.alert('Edit Visitor', 'This functionality will be implemented soon.');
  };

  // Handle delete visitor
  const handleDeleteVisitor = async (visitor) => {
    Alert.alert(
      'Delete Visitor',
      `Are you sure you want to delete ${visitor.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              // If using Firebase
              if (visitor.id) {
                await deleteDocument('visitors', visitor.id);
              }
              
              // Update local state
              setVisitors(prev => prev.filter(v => v.id !== visitor.id));
              
              // Close modal first, then clean up selected visitor reference
              setModalVisible(false);
              setTimeout(() => {
                setSelectedVisitor(null);
              }, 100);
            } catch (error) {
              console.error('Error deleting visitor:', error);
              Alert.alert('Error', 'Failed to delete visitor');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  // Filter visitors based on search
  const filteredVisitors = visitors.filter(visitor => 
    visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    visitor.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectVisitor = (visitor) => {
    if (visitor) {
      setSelectedVisitor({...visitor}); // Create a copy instead of a reference
      setModalVisible(true);
    }
  };

  const VisitorDetailModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView>
            {selectedVisitor && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedVisitor.name}</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Contact Information</Text>
                  <Text style={styles.detailItem}>Email: {selectedVisitor.email}</Text>
                  <Text style={styles.detailItem}>Department: {selectedVisitor.department}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Program Information</Text>
                  <Text style={styles.detailItem}>Mentor: {selectedVisitor.mentorId}</Text>
                  <Text style={styles.detailItem}>Progress: {selectedVisitor.progress}%</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Medical Information</Text>
                  <Text style={styles.detailItem}>Allergies: {selectedVisitor.medicalInfo?.allergies?.join(', ') || 'None'}</Text>
                  <Text style={styles.detailItem}>Medications: {selectedVisitor.medicalInfo?.medications?.join(', ') || 'None'}</Text>
                  <Text style={styles.detailItem}>Medical Conditions: {selectedVisitor.medicalInfo?.conditions?.join(', ') || 'None'}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Emergency Contact</Text>
                  <Text style={styles.detailItem}>Name: {selectedVisitor.emergencyContact?.name || 'N/A'}</Text>
                  <Text style={styles.detailItem}>Relationship: {selectedVisitor.emergencyContact?.relationship || 'N/A'}</Text>
                  <Text style={styles.detailItem}>Phone: {selectedVisitor.emergencyContact?.phone || 'N/A'}</Text>
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => handleEditVisitor(selectedVisitor)}
                  >
                    <Ionicons name="create-outline" size={18} color="white" />
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteVisitor(selectedVisitor)}
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

  const renderVisitorItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.visitorCard}
      onPress={() => handleSelectVisitor(item)}
    >
      <View style={styles.visitorInfo}>
        <Text style={styles.visitorName}>{item.name}</Text>
        <Text style={styles.visitorEmail}>{item.email}</Text>
        <Text style={styles.visitorDepartment}>{item.department}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="gray" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Manage Visitors</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search visitors..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredVisitors}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderVisitorItem}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      <VisitorDetailModal />
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
  visitorCard: {
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
  visitorInfo: {
    flex: 1,
  },
  visitorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  visitorEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  visitorDepartment: {
    fontSize: 14,
    color: '#888',
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
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
});

export default ManageVisitorsScreen; 