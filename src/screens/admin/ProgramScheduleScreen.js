import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { format, parseISO, parse } from 'date-fns';

// Import Firebase functions
import { getDocuments, updateDocument, deleteDocument, addDocument, queryDocuments } from '../../utils/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../utils/firebaseConfig';

// Import schedule service
import { 
  getScheduleByDay, 
  deleteScheduleItem, 
  addScheduleItem, 
  updateScheduleItem,
  SESSION_DATES,
  initializeSchedule,
  formatScheduleDate,
  formatScheduleTime
} from '../../utils/scheduleService';

// Import demo data
import { ACTIVITIES, CLASSES } from '../../utils/demoData';

const ProgramScheduleScreen = () => {
  const navigation = useNavigation();
  const [currentDay, setCurrentDay] = useState(1); // Day 1 or Day 2
  const [scheduleItems, setScheduleItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addFormVisible, setAddFormVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  // Form state for new activity
  const [newActivity, setNewActivity] = useState({
    title: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    type: 'activity',
    day: 1
  });

  // Initialize schedule data on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        // Initialize schedule to ensure defaults are set
        await initializeSchedule();
      } catch (error) {
        console.error('Error initializing schedule:', error);
        Alert.alert('Error', 'Failed to initialize schedule data.');
      } finally {
        setLoading(false);
      }
    };
    
    initializeData();
  }, []);
  
  // Fetch schedule items when current day changes
  useEffect(() => {
    fetchScheduleItems();
  }, [currentDay]);

  // Convert time string to minutes for proper sorting
  const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    
    try {
      // First standardize the time format
      let hour = 0;
      let minute = 0;
      
      // Handle HH:MM format (24-hour)
      if (timeStr.includes(':') && !timeStr.toLowerCase().includes('am') && !timeStr.toLowerCase().includes('pm')) {
        const [hourStr, minuteStr] = timeStr.split(':');
        hour = parseInt(hourStr, 10);
        minute = parseInt(minuteStr, 10);
      }
      // Handle HH:MM AM/PM format
      else if (timeStr.includes(':')) {
        const isPM = timeStr.toLowerCase().includes('pm');
        const isAM = timeStr.toLowerCase().includes('am');
        
        // Strip out the AM/PM
        let timePart = timeStr.toLowerCase()
          .replace('am', '')
          .replace('pm', '')
          .replace('a.m.', '')
          .replace('p.m.', '')
          .replace(' ', '');
        
        const [hourStr, minuteStr] = timePart.split(':');
        hour = parseInt(hourStr, 10);
        minute = parseInt(minuteStr, 10);
        
        // Convert to 24-hour format
        if (isPM && hour < 12) {
          hour += 12;
        } else if (isAM && hour === 12) {
          hour = 0;
        }
      }
      
      return (hour * 60) + minute;
    } catch (error) {
      console.error('Error parsing time:', timeStr, error);
      return 0;
    }
  };

  const fetchScheduleItems = async () => {
    try {
      setLoading(true);
      
      // Get schedule items for the current day using scheduleService
      const items = await getScheduleByDay(currentDay);
      
      // Sort by start time effectively
      items.sort((a, b) => {
        const timeA = timeToMinutes(a.startTime);
        const timeB = timeToMinutes(b.startTime);
        return timeA - timeB;
      });
      
      setScheduleItems(items);
    } catch (error) {
      console.error('Error fetching schedule items:', error);
      Alert.alert('Error', 'Failed to load schedule data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditItem = (item) => {
    // Set up the form with the current item's data
    setNewActivity({
      id: item.id,
      title: item.title || '',
      startTime: item.startTime || '',
      endTime: item.endTime || '',
      location: item.location || '',
      description: item.description || '',
      type: item.type || 'activity',
      day: item.day || currentDay,
      date: item.date || SESSION_DATES[currentDay - 1]
    });
    
    setEditMode(true);
    setModalVisible(false);
    setAddFormVisible(true);
  };

  const handleDeleteItem = async (item) => {
    if (!item || !item.id) {
      console.error('Invalid item or missing ID:', item);
      Alert.alert('Error', 'Cannot delete this item due to missing information');
      return;
    }
    
    const itemName = item.title || 'selected item';
    
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
              
              // Attempt deletion using scheduleService
              const success = await deleteScheduleItem(item.id);
              
              if (success) {
                // Update local state
                setScheduleItems(prev => prev.filter(i => i.id !== item.id));
                
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
    // Reset form for new item
    setNewActivity({
      title: '',
      startTime: '',
      endTime: '',
      location: '',
      description: '',
      type: 'activity',
      day: currentDay,
      date: SESSION_DATES[currentDay - 1]
    });
    
    setEditMode(false);
    setAddFormVisible(true);
  };

  // Handle form submission (for both add and edit)
  const handleSubmitForm = async () => {
    // Validate form - only title and times are required
    if (!newActivity.title || !newActivity.startTime || !newActivity.endTime) {
      Alert.alert('Error', 'Please fill in all required fields (title and time)');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare the item with additional fields
      const scheduleItem = {
        ...newActivity,
        day: currentDay,
        date: SESSION_DATES[currentDay - 1],
        updatedAt: new Date().toISOString(),
        isEditable: true
      };
      
      let success = false;
      let itemId = null;
      
      if (editMode && newActivity.id) {
        // Update existing item
        success = await updateScheduleItem(newActivity.id, scheduleItem);
        itemId = newActivity.id;
      } else {
        // Add new item
        itemId = await addScheduleItem(scheduleItem);
        success = !!itemId;
      }
      
      if (success) {
        // Reload schedule items to get updated data
        await fetchScheduleItems();
        
        // Reset form and close modal
        setNewActivity({
          title: '',
          startTime: '',
          endTime: '',
          location: '',
          description: '',
          type: 'activity',
          day: currentDay,
          date: SESSION_DATES[currentDay - 1]
        });
        
        setAddFormVisible(false);
        setEditMode(false);
        
        Alert.alert('Success', 
          editMode 
            ? 'Schedule item updated successfully!' 
            : 'New schedule item added successfully!'
        );
      } else {
        Alert.alert('Error', 
          editMode 
            ? 'Failed to update item. Please try again.' 
            : 'Failed to add item. Please try again.'
        );
      }
    } catch (error) {
      console.error('Error handling form submission:', error);
      Alert.alert('Error', 'Operation failed: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Add/Edit Form Modal
  const FormModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={addFormVisible}
      onRequestClose={() => setAddFormVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: '#2A2A2A' }]}>
          <ScrollView>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: '#fff' }]}>
                {editMode ? 'Edit Schedule Item' : 'Add New Schedule Item'} (Day {currentDay})
              </Text>
              <TouchableOpacity onPress={() => setAddFormVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: '#fff' }]}>Title *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: '#3A3A3A', color: '#fff', borderColor: '#555' }]}
                value={newActivity.title}
                onChangeText={(text) => setNewActivity(prev => ({ ...prev, title: text }))}
                placeholder="Enter schedule item title"
                placeholderTextColor="#999"
              />
            </View>
            
            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={[styles.label, { color: '#fff' }]}>Start Time *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: '#3A3A3A', color: '#fff', borderColor: '#555' }]}
                  value={newActivity.startTime}
                  onChangeText={(text) => setNewActivity(prev => ({ ...prev, startTime: text }))}
                  placeholder="Example: 09:00"
                  placeholderTextColor="#999"
                />
              </View>
              
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: '#fff' }]}>End Time *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: '#3A3A3A', color: '#fff', borderColor: '#555' }]}
                  value={newActivity.endTime}
                  onChangeText={(text) => setNewActivity(prev => ({ ...prev, endTime: text }))}
                  placeholder="Example: 10:30"
                  placeholderTextColor="#999"
                />
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: '#fff' }]}>Location (Optional)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: '#3A3A3A', color: '#fff', borderColor: '#555' }]}
                value={newActivity.location}
                onChangeText={(text) => setNewActivity(prev => ({ ...prev, location: text }))}
                placeholder="Enter location (optional)"
                placeholderTextColor="#999"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: '#fff' }]}>Type</Text>
              <View style={styles.typeSelector}>
                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    newActivity.type === 'activity' && styles.selectedType,
                    { backgroundColor: '#3A3A3A', borderColor: '#555' }
                  ]}
                  onPress={() => setNewActivity(prev => ({ ...prev, type: 'activity' }))}
                >
                  <Text style={[
                    newActivity.type === 'activity' ? styles.selectedTypeText : { color: '#ccc' }
                  ]}>
                    Activity
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    newActivity.type === 'session' && styles.selectedType,
                    { backgroundColor: '#3A3A3A', borderColor: '#555' }
                  ]}
                  onPress={() => setNewActivity(prev => ({ ...prev, type: 'session' }))}
                >
                  <Text style={[
                    newActivity.type === 'session' ? styles.selectedTypeText : { color: '#ccc' }
                  ]}>
                    Session
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    newActivity.type === 'meal' && styles.selectedType,
                    { backgroundColor: '#3A3A3A', borderColor: '#555' }
                  ]}
                  onPress={() => setNewActivity(prev => ({ ...prev, type: 'meal' }))}
                >
                  <Text style={[
                    newActivity.type === 'meal' ? styles.selectedTypeText : { color: '#ccc' }
                  ]}>
                    Meal
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: '#fff' }]}>Description (Optional)</Text>
              <TextInput
                style={[
                  styles.input, 
                  styles.textArea, 
                  { backgroundColor: '#3A3A3A', color: '#fff', borderColor: '#555' }
                ]}
                value={newActivity.description}
                onChangeText={(text) => setNewActivity(prev => ({ ...prev, description: text }))}
                placeholder="Enter description (optional)"
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
              />
            </View>

            <TouchableOpacity 
              style={[styles.submitButton, { backgroundColor: '#F9A826' }]}
              onPress={handleSubmitForm}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {editMode ? 'Update Schedule Item' : 'Add Schedule Item'}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // Detail Modal
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
            <View style={[styles.modalContent, { backgroundColor: '#2A2A2A' }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: '#fff' }]}>Details</Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
              <View style={styles.loadingContainer}>
                <Text style={[styles.loadingText, { color: '#ccc' }]}>No item to display</Text>
              </View>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#555', alignSelf: 'center', marginTop: 20 }]}
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
          <View style={[styles.modalContent, { backgroundColor: '#2A2A2A' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: '#fff' }]}>
                {item?.type === 'session' ? 'Session' : item?.type === 'meal' ? 'Meal' : 'Activity'} Details
              </Text>
              <TouchableOpacity onPress={onClose} disabled={loading}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#F9A826" />
                <Text style={[styles.loadingText, { color: '#ccc' }]}>Processing...</Text>
              </View>
            ) : (
              <>
                <View style={styles.detailSection}>
                  <Text style={[styles.sectionTitle, { color: '#ccc' }]}>Title</Text>
                  <Text style={[styles.detailItem, { color: '#fff' }]}>{item?.title || 'N/A'}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={[styles.sectionTitle, { color: '#ccc' }]}>Time</Text>
                  <Text style={[styles.detailItem, { color: '#fff' }]}>
                    {(item?.startTime && item?.endTime) ? `${item.startTime} - ${item.endTime}` : 'N/A'}
                  </Text>
                </View>

                {item?.location && (
                  <View style={styles.detailSection}>
                    <Text style={[styles.sectionTitle, { color: '#ccc' }]}>Location</Text>
                    <Text style={[styles.detailItem, { color: '#fff' }]}>{item.location}</Text>
                  </View>
                )}

                {item?.description && (
                  <View style={styles.detailSection}>
                    <Text style={[styles.sectionTitle, { color: '#ccc' }]}>Description</Text>
                    <Text style={[styles.detailItem, { color: '#fff' }]}>{item.description}</Text>
                  </View>
                )}
                
                <View style={styles.detailSection}>
                  <Text style={[styles.sectionTitle, { color: '#ccc' }]}>Day</Text>
                  <Text style={[styles.detailItem, { color: '#fff' }]}>
                    Day {item?.day || '?'}
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
                  disabled={loading || !item?.isEditable}
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

  // Render schedule item row with quick action buttons
  const renderItem = ({ item }) => {
    let itemTypeColor;
    let typeLabel;
    
    switch(item.type) {
      case 'session':
        itemTypeColor = '#4a6ea9';
        typeLabel = 'Session';
        break;
      case 'meal':
        itemTypeColor = '#2ecc71';
        typeLabel = 'Meal';
        break;
      case 'free':
        itemTypeColor = '#f39c12';
        typeLabel = 'Free Time';
        break;
      default:
        itemTypeColor = '#F9A826';
        typeLabel = 'Activity';
    }
    
    return (
      <View style={styles.itemCardContainer}>
        <TouchableOpacity 
          style={[styles.itemCard, { backgroundColor: '#2A2A2A' }]}
          onPress={() => handleSelectItem(item)}
        >
          <View style={[styles.itemTypeIndicator, { backgroundColor: itemTypeColor }]} />
          <View style={styles.itemInfo}>
            <Text style={[styles.itemName, { color: '#fff' }]}>{item.title}</Text>
            <Text style={[styles.itemTime, { color: '#ccc' }]}>
              {item.startTime && item.endTime ? `${item.startTime} - ${item.endTime}` : 'Time not specified'}
            </Text>
            {item.location && (
              <Text style={[styles.itemLocation, { color: '#999' }]}>{item.location}</Text>
            )}
          </View>
          <View style={[styles.itemBadge, { backgroundColor: '#3A3A3A' }]}>
            <Text style={[styles.itemBadgeText, { color: itemTypeColor }]}>{typeLabel}</Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.quickActionButton, { backgroundColor: '#4a6ea9' }]}
            onPress={() => handleEditItem(item)}
          >
            <Ionicons name="pencil" size={18} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickActionButton, { backgroundColor: '#e74c3c' }]}
            onPress={() => handleDeleteItem(item)}
            disabled={!item.isEditable}
          >
            <Ionicons name="trash" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Render empty state when no items are available
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="calendar-outline" size={64} color="#666" />
      <Text style={styles.emptyStateTitle}>
        No Schedule Items Found
      </Text>
      <Text style={styles.emptyStateDescription}>
        There are no schedule items available for Day {currentDay}. Tap the + button to add one.
      </Text>
    </View>
  );

  // Render loading indicator
  const renderLoadingIndicator = () => (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator size="large" color="#F9A826" />
      <Text style={[styles.loadingText, { color: '#fff' }]}>Loading...</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Program Schedule</Text>
        <View style={styles.headerButtonsContainer}>
          <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
            <Ionicons name="add" size={20} color="#FFF" />
            <Text style={styles.addButtonText}>Add Item</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchScheduleItems}>
            <Ionicons name="refresh" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, currentDay === 1 && styles.activeTab]}
          onPress={() => setCurrentDay(1)}
        >
          <Text style={[styles.tabText, currentDay === 1 && styles.activeTabText]}>
            Day 1
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, currentDay === 2 && styles.activeTab]}
          onPress={() => setCurrentDay(2)}
        >
          <Text style={[styles.tabText, currentDay === 2 && styles.activeTabText]}>
            Day 2
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        renderLoadingIndicator()
      ) : (
        <FlatList
          data={scheduleItems}
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

      {/* Add/Edit Form Modal */}
      <FormModal />
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
    marginRight: 8,
  },
  refreshButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4a6ea9',
    padding: 6,
    borderRadius: 16,
    width: 32,
    height: 32,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#2A2A2A',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#F9A826',
  },
  tabText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#F9A826',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 80,
  },
  itemCardContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  itemCard: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  quickActions: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  quickActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  itemTypeIndicator: {
    width: 6,
  },
  itemInfo: {
    flex: 1,
    padding: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemTime: {
    fontSize: 14,
    marginBottom: 4,
  },
  itemLocation: {
    fontSize: 14,
  },
  itemBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'center',
    marginRight: 12,
  },
  itemBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: '80%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  detailSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  detailItem: {
    fontSize: 16,
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
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  typeOption: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginRight: 8,
    borderRadius: 8,
  },
  selectedType: {
    backgroundColor: '#F9A826',
    borderColor: '#F9A826',
  },
  selectedTypeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  submitButton: {
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
});

export default ProgramScheduleScreen; 