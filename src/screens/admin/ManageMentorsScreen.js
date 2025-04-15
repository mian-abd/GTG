import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Import Firebase functions
import { getDocuments, updateDocument, deleteDocument, addDocument } from '../../utils/firebaseConfig';

// Import demo data
import { MENTORS } from '../../utils/demoData';

const ManageMentorsScreen = () => {
  const [mentors, setMentors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addFormVisible, setAddFormVisible] = useState(false);
  const [newMentor, setNewMentor] = useState({
    name: '',
    email: '',
    department: '',
    biography: '',
    students: []
  });
  
  // Fetch mentors from Firebase
  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
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

  // Handle edit mentor
  const handleEditMentor = (mentor) => {
    // Navigate to edit form or show edit modal
    console.log('Edit mentor:', mentor);
    Alert.alert('Edit Mentor', 'This functionality will be implemented soon.');
  };

  // Handle delete mentor
  const handleDeleteMentor = async (mentor) => {
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
              setLoading(true);
              // If using Firebase
              if (mentor.id) {
                await deleteDocument('mentors', mentor.id);
              }
              
              // Update local state
              setMentors(prev => prev.filter(m => m.id !== mentor.id));
              
              // Close modal first, then clean up selected mentor reference
              setModalVisible(false);
              setTimeout(() => {
                setSelectedMentor(null);
              }, 100);
            } catch (error) {
              console.error('Error deleting mentor:', error);
              Alert.alert('Error', 'Failed to delete mentor');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  // Handle add mentor form submit
  const handleAddMentorSubmit = async () => {
    // Validate form
    if (!newMentor.name || !newMentor.email || !newMentor.department) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      // Add to Firebase
      const mentorId = await addDocument('mentors', newMentor);
      
      // Update local state
      const addedMentor = {
        id: mentorId,
        ...newMentor
      };
      
      setMentors(prev => [...prev, addedMentor]);
      
      // Reset form and close modal
      setNewMentor({
        name: '',
        email: '',
        department: '',
        biography: '',
        students: []
      });
      
      setAddFormVisible(false);
      setAddModalVisible(false);
      
    } catch (error) {
      console.error('Error adding mentor:', error);
      Alert.alert('Error', 'Failed to add mentor');
    } finally {
      setLoading(false);
    }
  };

  // Add mentor form modal
  const AddMentorFormModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={addFormVisible}
      onRequestClose={() => setAddFormVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Mentor</Text>
              <TouchableOpacity onPress={() => setAddFormVisible(false)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={styles.input}
                value={newMentor.name}
                onChangeText={(text) => setNewMentor(prev => ({ ...prev, name: text }))}
                placeholder="Enter name"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                value={newMentor.email}
                onChangeText={(text) => setNewMentor(prev => ({ ...prev, email: text }))}
                placeholder="Enter email"
                keyboardType="email-address"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Department *</Text>
              <TextInput
                style={styles.input}
                value={newMentor.department}
                onChangeText={(text) => setNewMentor(prev => ({ ...prev, department: text }))}
                placeholder="Enter department"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Biography</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newMentor.biography}
                onChangeText={(text) => setNewMentor(prev => ({ ...prev, biography: text }))}
                placeholder="Enter biography"
                multiline
                numberOfLines={4}
              />
            </View>
            
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleAddMentorSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitButtonText}>Add Mentor</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

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
              onPress={() => {
                setAddModalVisible(false);
                setAddFormVisible(true);
              }}
            >
              <Ionicons name="person-add-outline" size={22} color="#333" />
              <Text style={styles.addModalOptionText}>Add Mentor Manually</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.addModalOption}
              onPress={() => {
                setAddModalVisible(false);
                // Import from Excel
                Alert.alert('Import from Excel', 'This functionality will be implemented soon.');
              }}
            >
              <Ionicons name="document-outline" size={22} color="#333" />
              <Text style={styles.addModalOptionText}>Import from Excel</Text>
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
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView>
            {selectedMentor && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedMentor.name}</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Contact Information</Text>
                  <Text style={styles.detailItem}>Email: {selectedMentor.email}</Text>
                  <Text style={styles.detailItem}>Department: {selectedMentor.department}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Biography</Text>
                  <Text style={styles.detailItem}>{selectedMentor.biography}</Text>
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

                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => handleEditMentor(selectedMentor)}
                  >
                    <Ionicons name="create-outline" size={18} color="white" />
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteMentor(selectedMentor)}
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
        <Text style={styles.mentorEmail}>{item.email}</Text>
        <Text style={styles.mentorDepartment}>{item.department}</Text>
        <Text style={styles.studentCount}>
          Students: {item.students.length}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="gray" />
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

      <FlatList
        data={filteredMentors}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMentorItem}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddMentor}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      <MentorDetailModal />
      <AddOptionModal />
      <AddMentorFormModal />
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
});

export default ManageMentorsScreen; 