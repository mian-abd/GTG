import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Import Firebase functions
import { getDocuments, updateDocument, deleteDocument, addDocument } from '../../utils/firebaseConfig';

// Import demo data
import { ACTIVITIES, CLASSES } from '../../utils/demoData';

const ProgramScheduleScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('activities');
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addFormVisible, setAddFormVisible] = useState(false);
  
  // Form state for new activity
  const [newActivity, setNewActivity] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    description: '',
    participants: []
  });

  // Form state for new class
  const [newClass, setNewClass] = useState({
    name: '',
    instructor: '',
    schedule: {
      days: [],
      time: ''
    },
    location: '',
    description: ''
  });
  
  useEffect(() => {
    if (activeTab === 'activities') {
      fetchActivities();
    } else {
      fetchClasses();
    }
  }, [activeTab]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const fetchedActivities = await getDocuments('activities');
      if (fetchedActivities && fetchedActivities.length > 0) {
        setItems(fetchedActivities);
      } else {
        // Fallback to demo data if no data in Firebase
        setItems(ACTIVITIES);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      // Fallback to demo data
      setItems(ACTIVITIES);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const fetchedClasses = await getDocuments('classes');
      if (fetchedClasses && fetchedClasses.length > 0) {
        setItems(fetchedClasses);
      } else {
        // Fallback to demo data if no data in Firebase
        setItems(CLASSES);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      // Fallback to demo data
      setItems(CLASSES);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle edit item
  const handleEditItem = (item) => {
    // Navigate to edit form or show edit modal
    console.log('Edit item:', item);
    Alert.alert('Edit Item', 'This functionality will be implemented soon.');
  };

  // Handle delete item
  const handleDeleteItem = async (item) => {
    if (!item || !item.id) {
      console.error('Invalid item or missing ID:', item);
      Alert.alert('Error', 'Cannot delete this item due to missing information');
      return;
    }
    
    const collectionName = activeTab === 'activities' ? 'activities' : 'classes';
    const itemName = item.name || 'selected item';
    
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete ${itemName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              
              // First close the modal
              setModalVisible(false);
              
              // Clear the selected item reference immediately after modal closes
              setTimeout(() => {
                setSelectedItem(null);
              }, 200);
              
              // Attempt deletion from Firestore
              const success = await deleteDocument(collectionName, item.id);
              
              if (success) {
                // Update local state
                setItems(prev => {
                  const newItems = prev.filter(i => i.id !== item.id);
                  return newItems;
                });
                
                // Show success message
                setTimeout(() => {
                  Alert.alert(
                    'Success', 
                    `${itemName} has been deleted successfully.`,
                    [{ text: 'OK' }]
                  );
                }, 300);
              } else {
                // Handle deletion failure
                Alert.alert('Error', 'Failed to delete item. Please try again.');
              }
            } catch (error) {
              console.error('Error deleting item:', error);
              Alert.alert('Error', 'Failed to delete item: ' + (error.message || 'Unknown error'));
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleSelectItem = (item) => {
    if (item) {
      // Create a deep copy to prevent referential issues
      const itemCopy = JSON.parse(JSON.stringify(item));
      setSelectedItem(itemCopy);
      setTimeout(() => {
    setModalVisible(true);
      }, 50); // Small delay to ensure state update completes
    }
  };

  const handleAddItem = () => {
    setAddModalVisible(true);
  };

  // Handle add activity submit
  const handleAddActivitySubmit = async () => {
    // Validate form
    if (!newActivity.name || !newActivity.date || !newActivity.time || !newActivity.location) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      // Add to Firebase
      const activityId = await addDocument('activities', newActivity);
      
      // Update local state
      const addedActivity = {
        id: activityId,
        ...newActivity
      };
      
      setItems(prev => [...prev, addedActivity]);
      
      // Reset form and close modal
      setNewActivity({
        name: '',
        date: '',
        time: '',
        location: '',
        description: '',
        participants: []
      });
      
      setAddFormVisible(false);
      setAddModalVisible(false);
      
      // Remove success alert to prevent app from freezing
    } catch (error) {
      console.error('Error adding activity:', error);
      Alert.alert('Error', 'Failed to add activity');
    } finally {
      setLoading(false);
    }
  };

  // Handle add class submit
  const handleAddClassSubmit = async () => {
    // Validate form
    if (!newClass.name || !newClass.instructor || !newClass.location) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      // Add to Firebase
      const classId = await addDocument('classes', newClass);
      
      // Update local state
      const addedClass = {
        id: classId,
        ...newClass
      };
      
      setItems(prev => [...prev, addedClass]);
      
      // Reset form and close modal
      setNewClass({
        name: '',
        instructor: '',
        schedule: {
          days: [],
          time: ''
        },
        location: '',
        description: ''
      });
      
      setAddFormVisible(false);
      setAddModalVisible(false);
      
      // Remove success alert to prevent app from freezing
    } catch (error) {
      console.error('Error adding class:', error);
      Alert.alert('Error', 'Failed to add class');
    } finally {
      setLoading(false);
    }
  };

  // Add form modal
  const AddFormModal = () => (
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
              <Text style={styles.modalTitle}>
                {activeTab === 'activities' ? 'Add New Activity' : 'Add New Class'}
              </Text>
              <TouchableOpacity onPress={() => setAddFormVisible(false)}>
                    <Ionicons name="close" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                
                {activeTab === 'activities' ? (
              // Activity form
              <>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Activity Name *</Text>
                  <TextInput
                    style={styles.input}
                    value={newActivity.name}
                    onChangeText={(text) => setNewActivity(prev => ({ ...prev, name: text }))}
                    placeholder="Enter activity name"
                  />
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Date *</Text>
                  <TextInput
                    style={styles.input}
                    value={newActivity.date}
                    onChangeText={(text) => setNewActivity(prev => ({ ...prev, date: text }))}
                    placeholder="YYYY-MM-DD"
                  />
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Time *</Text>
                  <TextInput
                    style={styles.input}
                    value={newActivity.time}
                    onChangeText={(text) => setNewActivity(prev => ({ ...prev, time: text }))}
                    placeholder="HH:MM"
                  />
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Location *</Text>
                  <TextInput
                    style={styles.input}
                    value={newActivity.location}
                    onChangeText={(text) => setNewActivity(prev => ({ ...prev, location: text }))}
                    placeholder="Enter location"
                  />
                    </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={newActivity.description}
                    onChangeText={(text) => setNewActivity(prev => ({ ...prev, description: text }))}
                    placeholder="Enter description"
                    multiline
                    numberOfLines={4}
                  />
                    </View>

                <TouchableOpacity 
                  style={styles.submitButton}
                  onPress={handleAddActivitySubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.submitButtonText}>Add Activity</Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              // Class form
              <>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Class Name *</Text>
                  <TextInput
                    style={styles.input}
                    value={newClass.name}
                    onChangeText={(text) => setNewClass(prev => ({ ...prev, name: text }))}
                    placeholder="Enter class name"
                  />
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Instructor *</Text>
                  <TextInput
                    style={styles.input}
                    value={newClass.instructor}
                    onChangeText={(text) => setNewClass(prev => ({ ...prev, instructor: text }))}
                    placeholder="Enter instructor name"
                  />
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Schedule Time</Text>
                  <TextInput
                    style={styles.input}
                    value={newClass.schedule.time}
                    onChangeText={(text) => setNewClass(prev => ({ 
                      ...prev, 
                      schedule: { ...prev.schedule, time: text } 
                    }))}
                    placeholder="HH:MM"
                  />
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Schedule Days</Text>
                  <TextInput
                    style={styles.input}
                    value={newClass.schedule.days.join(', ')}
                    onChangeText={(text) => setNewClass(prev => ({ 
                      ...prev, 
                      schedule: { ...prev.schedule, days: text.split(', ') } 
                    }))}
                    placeholder="Monday, Wednesday, Friday"
                  />
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Location *</Text>
                  <TextInput
                    style={styles.input}
                    value={newClass.location}
                    onChangeText={(text) => setNewClass(prev => ({ ...prev, location: text }))}
                    placeholder="Enter location"
                  />
                    </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={newClass.description}
                    onChangeText={(text) => setNewClass(prev => ({ ...prev, description: text }))}
                    placeholder="Enter description"
                    multiline
                    numberOfLines={4}
                  />
                    </View>
                
                <TouchableOpacity 
                  style={styles.submitButton}
                  onPress={handleAddClassSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.submitButtonText}>Add Class</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
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
              <Ionicons name="add-circle-outline" size={22} color="#333" />
              <Text style={styles.addModalOptionText}>
                {activeTab === 'activities' ? 'Add Activity Manually' : 'Add Class Manually'}
              </Text>
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

  const DetailModal = ({ visible, onClose, item, onEdit, onDelete, loading }) => {
    // Safe guard against null item references
    if (!item && visible) {
      return (
        <Modal
          animationType="fade"
          transparent={true}
          visible={visible}
          onRequestClose={onClose}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Details</Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>No item to display</Text>
              </View>
              <TouchableOpacity
                style={[styles.actionButton, {backgroundColor: '#555', alignSelf: 'center', marginTop: 20}]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      );
    }
    
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          if (!loading) {
            onClose();
          }
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {item?.type === 'tour' ? 'Campus Tour' : 'Event'} Details
              </Text>
              <TouchableOpacity onPress={onClose} disabled={loading}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="goldenrod" />
                <Text style={styles.loadingText}>Processing...</Text>
              </View>
                ) : (
                  <>
                    <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Name</Text>
                  <Text style={styles.detailItem}>{item?.name || 'N/A'}</Text>
                    </View>

                    <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Date & Time</Text>
                  <Text style={styles.detailItem}>
                    {item?.date || 'N/A'}, {item?.startTime || ''} - {item?.endTime || ''}
                  </Text>
                    </View>

                    <View style={styles.detailSection}>
                      <Text style={styles.sectionTitle}>Location</Text>
                  <Text style={styles.detailItem}>{item?.location || 'N/A'}</Text>
                    </View>

                {item?.type === 'tour' && (
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Guide</Text>
                    <Text style={styles.detailItem}>{item?.guide || 'N/A'}</Text>
                  </View>
                )}
                
                {item?.type === 'event' && (
                  <>
                    <View style={styles.detailSection}>
                      <Text style={styles.sectionTitle}>Description</Text>
                      <Text style={styles.detailItem}>{item?.description || 'N/A'}</Text>
                    </View>
                    <View style={styles.detailSection}>
                      <Text style={styles.sectionTitle}>Host</Text>
                      <Text style={styles.detailItem}>{item?.host || 'N/A'}</Text>
                    </View>
                  </>
                )}

                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Participants</Text>
                  <Text style={styles.detailItem}>
                    {item?.participants?.length || 0} registered
                  </Text>
                </View>
              </>
            )}
            
            {!loading && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => onEdit(item)}
                  disabled={loading}
                >
                  <Ionicons name="pencil" size={20} color="white" />
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => onDelete(item)}
                  disabled={loading}
                >
                  <Ionicons name="trash" size={20} color="white" />
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
      </View>
    </Modal>
  );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemCard}
      onPress={() => handleSelectItem(item)}
    >
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        
        {activeTab === 'activities' ? (
          <>
            <Text style={styles.itemDate}>{item.date} at {item.time}</Text>
            <Text style={styles.itemLocation}>{item.location}</Text>
            <Text style={styles.participantCount}>
              Participants: {item.participants.length}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.itemInstructor}>Instructor: {item.instructor}</Text>
            <Text style={styles.itemSchedule}>
              {item.schedule.days.join(', ')} at {item.schedule.time}
            </Text>
            <Text style={styles.itemLocation}>{item.location}</Text>
          </>
        )}
      </View>
      <Ionicons name="chevron-forward" size={24} color="gray" />
    </TouchableOpacity>
  );

  // Render empty state when no items are available
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="calendar-outline" size={64} color="#ccc" />
      <Text style={styles.emptyStateTitle}>
        No {activeTab === 'activities' ? 'Activities' : 'Classes'} Found
      </Text>
      <Text style={styles.emptyStateDescription}>
        {searchQuery 
          ? `No ${activeTab} match your search criteria.` 
          : `There are no ${activeTab} available. Tap the + button to add one.`}
      </Text>
    </View>
  );

  // Render loading indicator
  const renderLoadingIndicator = () => (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator size="large" color="goldenrod" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );

  const navigateToRoomAssignment = () => {
    navigation.navigate('RoomAssignment');
  };

  const navigateToMentorSchedule = () => {
    navigation.navigate('MentorSchedule');
  };

  const navigateToStudentSchedule = () => {
    navigation.navigate('StudentSchedule');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Program Schedule</Text>
        <View style={styles.headerButtonsContainer}>
          <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
            <Ionicons name="add" size={20} color="#FFF" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.managementButtonsContainer}>
        <TouchableOpacity 
          style={styles.managementButton}
          onPress={navigateToRoomAssignment}
        >
          <Ionicons name="bed-outline" size={18} color="#FFF" />
          <Text style={styles.managementButtonText}>Room Assignments</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.managementButton}
          onPress={navigateToMentorSchedule}
        >
          <Ionicons name="time-outline" size={18} color="#FFF" />
          <Text style={styles.managementButtonText}>Mentor Schedules</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.managementButton}
          onPress={navigateToStudentSchedule}
        >
          <Ionicons name="book-outline" size={18} color="#FFF" />
          <Text style={styles.managementButtonText}>Student Classes</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'activities' && styles.activeTab]}
          onPress={() => setActiveTab('activities')}
        >
          <Text style={[styles.tabText, activeTab === 'activities' && styles.activeTabText]}>Activities</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'classes' && styles.activeTab]}
          onPress={() => setActiveTab('classes')}
        >
          <Text style={[styles.tabText, activeTab === 'classes' && styles.activeTabText]}>Classes</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#AAA" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#AAA"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading && !modalVisible && !addModalVisible ? (
        renderLoadingIndicator()
      ) : (
        <FlatList
          data={
            searchQuery
              ? items.filter(item =>
                  item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
                  (activeTab === 'classes' && item.instructor && item.instructor.toLowerCase().includes(searchQuery.toLowerCase()))
                )
              : items
          }
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState()}
        />
      )}

      {/* Detail Modal */}
      <DetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        item={selectedItem}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
        loading={loading}
      />

      {/* Add Modal */}
      <AddOptionModal />

      {/* Add Form Modal */}
      <AddFormModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1A1A1A',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerButtonsContainer: {
    flexDirection: 'row',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9A826',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  managementButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    backgroundColor: '#2A2A2A',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  managementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  managementButtonText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 6,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#2A2A2A',
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
  listContent: {
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
  itemDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemLocation: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  participantCount: {
    fontSize: 14,
    color: '#4a6ea9',
    fontWeight: '500',
  },
  itemInstructor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemSchedule: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
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
  loadingContainer: {
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginTop: 12,
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});

export default ProgramScheduleScreen; 