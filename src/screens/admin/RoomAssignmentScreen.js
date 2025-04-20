import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  ScrollView, 
  Alert, 
  ActivityIndicator,
  SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import Firebase functions
import { 
  getDocuments, 
  updateDocument, 
  deleteDocument, 
  addDocument,
  queryDocuments
} from '../../utils/firebaseConfig';

const RoomAssignmentScreen = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [people, setPeople] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [roomsModalVisible, setRoomsModalVisible] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [newRoom, setNewRoom] = useState({
    number: '',
    building: '',
    capacity: '2',
    type: 'standard', // standard, suite, accessible
    occupied: 0,
    assignedTo: []
  });

  useEffect(() => {
    fetchRooms();
    if (activeTab === 'students') {
      fetchStudents();
    } else {
      fetchMentors();
    }
  }, [activeTab]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const fetchedRooms = await getDocuments('rooms');
      setRooms(fetchedRooms || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      Alert.alert('Error', 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const fetchedStudents = await getDocuments('students');
      setPeople(fetchedStudents || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      Alert.alert('Error', 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const fetchedMentors = await getDocuments('mentors');
      setPeople(fetchedMentors || []);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      Alert.alert('Error', 'Failed to load mentors');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = async () => {
    if (!newRoom.number || !newRoom.building) {
      Alert.alert('Error', 'Room number and building are required');
      return;
    }

    try {
      setLoading(true);
      const roomId = await addDocument('rooms', {
        ...newRoom,
        capacity: parseInt(newRoom.capacity, 10) || 2,
        occupied: 0,
        assignedTo: []
      });

      // Add to local state
      const addedRoom = {
        id: roomId,
        ...newRoom,
        capacity: parseInt(newRoom.capacity, 10) || 2,
        occupied: 0,
        assignedTo: []
      };

      setRooms(prev => [...prev, addedRoom]);
      
      // Reset form
      setNewRoom({
        number: '',
        building: '',
        capacity: '2',
        type: 'standard',
        occupied: 0,
        assignedTo: []
      });
      
      setRoomsModalVisible(false);
      Alert.alert('Success', 'Room added successfully');
    } catch (error) {
      console.error('Error adding room:', error);
      Alert.alert('Error', 'Failed to add room');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (room) => {
    if (room.occupied > 0) {
      Alert.alert(
        'Room Occupied',
        'This room has occupants. Please reassign them before deleting the room.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Delete Room',
      `Are you sure you want to delete ${room.building} ${room.number}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const success = await deleteDocument('rooms', room.id);
              if (success) {
                setRooms(prev => prev.filter(r => r.id !== room.id));
                Alert.alert('Success', 'Room deleted successfully');
              } else {
                Alert.alert('Error', 'Failed to delete room');
              }
            } catch (error) {
              console.error('Error deleting room:', error);
              Alert.alert('Error', 'Failed to delete room');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleAssignRoom = async (person, room) => {
    if (room.occupied >= room.capacity) {
      Alert.alert('Room Full', 'This room has reached its capacity');
      return;
    }

    // Check if person already has a room
    const currentRoom = rooms.find(r => 
      r.assignedTo && r.assignedTo.some(a => a.id === person.id)
    );

    // Start a transaction to update both person and room
    try {
      setLoading(true);
      
      // If person already has a room, remove them from that room
      if (currentRoom) {
        await updateDocument('rooms', currentRoom.id, {
          assignedTo: currentRoom.assignedTo.filter(a => a.id !== person.id),
          occupied: currentRoom.occupied - 1
        });
        
        // Update local room state
        setRooms(prev => prev.map(r => {
          if (r.id === currentRoom.id) {
            return {
              ...r,
              assignedTo: r.assignedTo.filter(a => a.id !== person.id),
              occupied: r.occupied - 1
            };
          }
          return r;
        }));
      }
      
      // Add person to new room
      const personInfo = {
        id: person.id,
        name: `${person.firstName} ${person.lastName}`,
        type: activeTab === 'students' ? 'student' : 'mentor'
      };
      
      // Update the room
      await updateDocument('rooms', room.id, {
        assignedTo: [...(room.assignedTo || []), personInfo],
        occupied: (room.occupied || 0) + 1
      });
      
      // Update person with room info
      await updateDocument(
        activeTab === 'students' ? 'students' : 'mentors', 
        person.id, 
        {
          room: {
            id: room.id,
            number: room.number,
            building: room.building
          }
        }
      );
      
      // Update local states
      setRooms(prev => prev.map(r => {
        if (r.id === room.id) {
          return {
            ...r,
            assignedTo: [...(r.assignedTo || []), personInfo],
            occupied: (r.occupied || 0) + 1
          };
        }
        return r;
      }));
      
      setPeople(prev => prev.map(p => {
        if (p.id === person.id) {
          return {
            ...p,
            room: {
              id: room.id,
              number: room.number,
              building: room.building
            }
          };
        }
        return p;
      }));
      
      setAssignModalVisible(false);
      setModalVisible(false);
      Alert.alert('Success', `Room assigned to ${person.firstName} ${person.lastName}`);
    } catch (error) {
      console.error('Error assigning room:', error);
      Alert.alert('Error', 'Failed to assign room');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromRoom = async (person) => {
    // Find the room the person is assigned to
    const currentRoom = rooms.find(r => 
      r.assignedTo && r.assignedTo.some(a => a.id === person.id)
    );

    if (!currentRoom) {
      Alert.alert('No Room Assigned', 'This person does not have a room assigned');
      return;
    }

    try {
      setLoading(true);
      
      // Remove person from room
      await updateDocument('rooms', currentRoom.id, {
        assignedTo: currentRoom.assignedTo.filter(a => a.id !== person.id),
        occupied: currentRoom.occupied - 1
      });
      
      // Remove room from person
      await updateDocument(
        activeTab === 'students' ? 'students' : 'mentors', 
        person.id, 
        { room: null }
      );
      
      // Update local states
      setRooms(prev => prev.map(r => {
        if (r.id === currentRoom.id) {
          return {
            ...r,
            assignedTo: r.assignedTo.filter(a => a.id !== person.id),
            occupied: r.occupied - 1
          };
        }
        return r;
      }));
      
      setPeople(prev => prev.map(p => {
        if (p.id === person.id) {
          const { room, ...rest } = p;
          return rest;
        }
        return p;
      }));
      
      setModalVisible(false);
      Alert.alert('Success', `Room assignment removed for ${person.firstName} ${person.lastName}`);
    } catch (error) {
      console.error('Error removing room assignment:', error);
      Alert.alert('Error', 'Failed to remove room assignment');
    } finally {
      setLoading(false);
    }
  };

  const filteredPeople = people.filter(person => {
    const fullName = `${person.firstName} ${person.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const filteredRooms = rooms.filter(room => {
    const roomIdentifier = `${room.building} ${room.number}`.toLowerCase();
    return roomIdentifier.includes(searchQuery.toLowerCase());
  });

  const renderPersonItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemCard}
      onPress={() => {
        setSelectedPerson(item);
        setModalVisible(true);
      }}
    >
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.firstName} {item.lastName}</Text>
        <Text style={styles.itemDetail}>
          {activeTab === 'students' ? 'Student' : 'Mentor'}
        </Text>
        <Text style={styles.itemDetail}>
          Room: {item.room ? `${item.room.building} ${item.room.number}` : 'Not Assigned'}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="gray" />
    </TouchableOpacity>
  );

  const renderRoomItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemCard}
      onPress={() => {
        setSelectedRoom(item);
        setAssignModalVisible(true);
      }}
    >
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.building} {item.number}</Text>
        <Text style={styles.itemDetail}>Type: {item.type}</Text>
        <Text style={styles.itemDetail}>
          Occupancy: {item.occupied || 0}/{item.capacity}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="gray" />
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="bed-outline" size={64} color="#ccc" />
      <Text style={styles.emptyStateTitle}>
        No {activeTab === 'rooms' ? 'Rooms' : 
            activeTab === 'students' ? 'Students' : 'Mentors'} Found
      </Text>
      <Text style={styles.emptyStateDescription}>
        {searchQuery 
          ? `No results match your search criteria.` 
          : `There are no ${activeTab} available yet.`}
      </Text>
    </View>
  );
  
  const renderLoadingIndicator = () => (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator size="large" color="goldenrod" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );

  // Modal for adding a new room
  const AddRoomModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={roomsModalVisible}
      onRequestClose={() => setRoomsModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Room</Text>
            <TouchableOpacity onPress={() => setRoomsModalVisible(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <ScrollView>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Room Number *</Text>
              <TextInput
                style={styles.input}
                value={newRoom.number}
                onChangeText={(text) => setNewRoom(prev => ({ ...prev, number: text }))}
                placeholder="e.g., 101"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Building *</Text>
              <TextInput
                style={styles.input}
                value={newRoom.building}
                onChangeText={(text) => setNewRoom(prev => ({ ...prev, building: text }))}
                placeholder="e.g., West Hall"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Capacity</Text>
              <TextInput
                style={styles.input}
                value={newRoom.capacity}
                onChangeText={(text) => setNewRoom(prev => ({ ...prev, capacity: text }))}
                placeholder="2"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Room Type</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity 
                  style={[
                    styles.radioOption, 
                    newRoom.type === 'standard' && styles.radioSelected
                  ]}
                  onPress={() => setNewRoom(prev => ({ ...prev, type: 'standard' }))}
                >
                  <Text style={styles.radioText}>Standard</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.radioOption, 
                    newRoom.type === 'suite' && styles.radioSelected
                  ]}
                  onPress={() => setNewRoom(prev => ({ ...prev, type: 'suite' }))}
                >
                  <Text style={styles.radioText}>Suite</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.radioOption, 
                    newRoom.type === 'accessible' && styles.radioSelected
                  ]}
                  onPress={() => setNewRoom(prev => ({ ...prev, type: 'accessible' }))}
                >
                  <Text style={styles.radioText}>Accessible</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleAddRoom}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitButtonText}>Add Room</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // Person details modal
  const PersonDetailsModal = () => {
    if (!selectedPerson) return null;
    
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedPerson.firstName} {selectedPerson.lastName}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>
                {activeTab === 'students' ? 'Student' : 'Mentor'} Information
              </Text>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Email:</Text>
                <Text style={styles.detailValue}>{selectedPerson.email || 'N/A'}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phone:</Text>
                <Text style={styles.detailValue}>{selectedPerson.phone || 'N/A'}</Text>
              </View>
              
              {activeTab === 'students' && (
                <>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Student ID:</Text>
                    <Text style={styles.detailValue}>{selectedPerson.studentId || 'N/A'}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Program:</Text>
                    <Text style={styles.detailValue}>{selectedPerson.program || 'N/A'}</Text>
                  </View>
                </>
              )}
              
              {activeTab === 'mentors' && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Role:</Text>
                  <Text style={styles.detailValue}>{selectedPerson.role || 'N/A'}</Text>
                </View>
              )}
            </View>
            
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Room Assignment</Text>
              
              {selectedPerson.room ? (
                <>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Building:</Text>
                    <Text style={styles.detailValue}>{selectedPerson.room.building}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Room Number:</Text>
                    <Text style={styles.detailValue}>{selectedPerson.room.number}</Text>
                  </View>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleRemoveFromRoom(selectedPerson)}
                  >
                    <Ionicons name="trash-outline" size={18} color="white" />
                    <Text style={styles.buttonText}>Remove Assignment</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.noAssignmentText}>No room currently assigned</Text>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => {
                      setModalVisible(false);
                      setTimeout(() => {
                        setSelectedRoom(null);
                        setAssignModalVisible(true);
                      }, 300);
                    }}
                  >
                    <Ionicons name="add-outline" size={18} color="white" />
                    <Text style={styles.buttonText}>Assign Room</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // Room assignment modal
  const RoomAssignmentModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={assignModalVisible}
        onRequestClose={() => setAssignModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedRoom ? `Select for ${selectedRoom.building} ${selectedRoom.number}` : 'Select a Room'}
              </Text>
              <TouchableOpacity onPress={() => setAssignModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.searchInput}
              placeholder={`Search rooms...`}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            
            <FlatList
              data={selectedRoom ? filteredPeople : filteredRooms}
              keyExtractor={(item) => item.id}
              renderItem={selectedRoom ? renderPersonItem : renderRoomItem}
              ListEmptyComponent={renderEmptyState}
              contentContainerStyle={[
                styles.listContainer,
                (selectedRoom ? filteredPeople : filteredRooms).length === 0 && styles.emptyListContainer
              ]}
            />
            
            {selectedRoom && selectedPerson && (
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton, styles.fullWidthButton]}
                onPress={() => handleAssignRoom(selectedPerson, selectedRoom)}
              >
                <Text style={styles.buttonText}>
                  Assign {selectedPerson.firstName} to {selectedRoom.building} {selectedRoom.number}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Room Assignments</Text>
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'students' && styles.activeTab]}
          onPress={() => setActiveTab('students')}
        >
          <Text style={[styles.tabText, activeTab === 'students' && styles.activeTabText]}>
            Students
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'mentors' && styles.activeTab]}
          onPress={() => setActiveTab('mentors')}
        >
          <Text style={[styles.tabText, activeTab === 'mentors' && styles.activeTabText]}>
            Mentors
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'rooms' && styles.activeTab]}
          onPress={() => setActiveTab('rooms')}
        >
          <Text style={[styles.tabText, activeTab === 'rooms' && styles.activeTabText]}>
            Rooms
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={`Search ${activeTab}...`}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <FlatList
        data={activeTab === 'rooms' ? filteredRooms : filteredPeople}
        keyExtractor={(item) => item.id}
        renderItem={activeTab === 'rooms' ? renderRoomItem : renderPersonItem}
        contentContainerStyle={[
          styles.listContainer,
          (activeTab === 'rooms' ? filteredRooms : filteredPeople).length === 0 && styles.emptyListContainer
        ]}
        ListEmptyComponent={renderEmptyState}
      />
      
      {loading && renderLoadingIndicator()}
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => {
          if (activeTab === 'rooms') {
            setRoomsModalVisible(true);
          } else {
            // Navigate to add student/mentor screen
            Alert.alert('Add Function', 'This functionality will be implemented soon.');
          }
        }}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
      
      <AddRoomModal />
      <PersonDetailsModal />
      <RoomAssignmentModal />
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
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  activeTab: {
    backgroundColor: 'goldenrod',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
  },
  activeTabText: {
    color: 'white',
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
  itemCard: {
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
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
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
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: 'goldenrod',
    backgroundColor: 'rgba(218, 165, 32, 0.1)',
  },
  radioText: {
    color: '#333',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: 'goldenrod',
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
  detailSection: {
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    width: '40%',
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  detailValue: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  noAssignmentText: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
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
  fullWidthButton: {
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: '80%',
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginTop: 12,
  },
});

export default RoomAssignmentScreen; 