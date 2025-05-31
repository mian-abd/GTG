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
import { useTheme } from '../../context/ThemeContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

// Import Firebase functions
import { 
  getDocuments, 
  updateDocument, 
  addDocument,
  queryDocuments 
} from '../../utils/firebaseConfig';

const MentorScheduleScreen = () => {
  const { theme } = useTheme();
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [selectedShift, setSelectedShift] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [shiftModalVisible, setShiftModalVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  
  // New shift form state
  const [newShift, setNewShift] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '08:00',
    endTime: '16:00',
    type: 'regular', // regular, ra
    location: '',
    notes: ''
  });

  useEffect(() => {
    fetchMentors();
    fetchShifts();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = mentors.filter(mentor => {
        const fullName = `${mentor.firstName} ${mentor.lastName}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
      });
      setFilteredMentors(filtered);
    } else {
      setFilteredMentors(mentors);
    }
  }, [searchQuery, mentors]);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const fetchedMentors = await getDocuments('mentors');
      setMentors(fetchedMentors || []);
      setFilteredMentors(fetchedMentors || []);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      Alert.alert('Error', 'Failed to load mentors');
    } finally {
      setLoading(false);
    }
  };

  const fetchShifts = async () => {
    try {
      setLoading(true);
      const fetchedShifts = await getDocuments('shifts');
      setShifts(fetchedShifts || []);
    } catch (error) {
      console.error('Error fetching shifts:', error);
      Alert.alert('Error', 'Failed to load shifts');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignShift = async (mentor, shift = null) => {
    try {
      setLoading(true);
      
      // Format the shift object
      const shiftData = shift || {
        ...newShift,
        mentorId: mentor.id,
        mentorName: `${mentor.firstName} ${mentor.lastName}`,
        status: 'scheduled',
        createdAt: new Date().toISOString()
      };
      
      // Add to Firestore
      const shiftId = await addDocument('shifts', shiftData);
      
      // Update local state
      const newShiftWithId = { ...shiftData, id: shiftId };
      setShifts(prev => [...prev, newShiftWithId]);
      
      // Update mentor with shift reference
      if (!mentor.shifts) {
        mentor.shifts = [];
      }
      
      await updateDocument('mentors', mentor.id, {
        shifts: [...mentor.shifts, { id: shiftId, date: shiftData.date }]
      });
      
      // Update local mentor state
      setMentors(prev => 
        prev.map(m => 
          m.id === mentor.id 
            ? {
                ...m, 
                shifts: [...(m.shifts || []), { id: shiftId, date: shiftData.date }]
              } 
            : m
        )
      );
      
      setShiftModalVisible(false);
      setModalVisible(false);
      
      Alert.alert('Success', `Shift assigned to ${mentor.firstName} ${mentor.lastName}`);
      
      // Reset form
      setNewShift({
        date: format(new Date(), 'yyyy-MM-dd'),
        startTime: '08:00',
        endTime: '16:00',
        type: 'regular',
        location: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error assigning shift:', error);
      Alert.alert('Error', 'Failed to assign shift');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveShift = async (shift) => {
    if (!shift || !shift.id) {
      Alert.alert('Error', 'Invalid shift selected');
      return;
    }
    
    Alert.alert(
      'Remove Shift',
      `Are you sure you want to remove this shift from ${shift.mentorName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              
              // Find mentor
              const mentor = mentors.find(m => m.id === shift.mentorId);
              
              if (mentor) {
                // Update mentor document
                await updateDocument('mentors', mentor.id, {
                  shifts: (mentor.shifts || []).filter(s => s.id !== shift.id)
                });
                
                // Update local mentor state
                setMentors(prev => 
                  prev.map(m => 
                    m.id === mentor.id 
                      ? {
                          ...m, 
                          shifts: (m.shifts || []).filter(s => s.id !== shift.id)
                        } 
                      : m
                  )
                );
              }
              
              // Delete shift document
              await updateDocument('shifts', shift.id, { 
                status: 'cancelled',
                updatedAt: new Date().toISOString()
              });
              
              // Update local shifts state
              setShifts(prev => 
                prev.map(s => 
                  s.id === shift.id
                    ? { ...s, status: 'cancelled' }
                    : s
                )
              );
              
              setModalVisible(false);
              Alert.alert('Success', 'Shift removed successfully');
            } catch (error) {
              console.error('Error removing shift:', error);
              Alert.alert('Error', 'Failed to remove shift');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const getMentorShifts = (mentorId) => {
    return shifts.filter(shift => 
      shift.mentorId === mentorId && 
      shift.status !== 'cancelled'
    );
  };
  
  const getFormattedShiftTime = (shift) => {
    return `${shift.startTime} - ${shift.endTime}`;
  };

  const renderMentorItem = ({ item }) => {
    const mentorShifts = getMentorShifts(item.id);
    const formattedDate = new Date(currentDate).toISOString().split('T')[0];
    const todayShifts = mentorShifts.filter(s => s.date === formattedDate);
    
    return (
      <TouchableOpacity 
        style={styles.itemCard}
        onPress={() => {
          setSelectedMentor(item);
          setModalVisible(true);
        }}
      >
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.firstName} {item.lastName}</Text>
          <Text style={styles.itemDetail}>Total Shifts: {mentorShifts.length}</Text>
          
          {todayShifts.length > 0 ? (
            <View style={styles.shiftsContainer}>
              <Text style={styles.todayShiftsTitle}>Today's Shifts:</Text>
              {todayShifts.map((shift, index) => (
                <View key={index} style={styles.shiftBadge}>
                  <Text style={styles.shiftBadgeText}>
                    {getFormattedShiftTime(shift)} ({shift.type})
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noShiftsText}>No shifts scheduled for today</Text>
          )}
        </View>
        <Ionicons name="chevron-forward" size={24} color="gray" />
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="calendar-outline" size={64} color="#ccc" />
      <Text style={styles.emptyStateTitle}>No Mentors Found</Text>
      <Text style={styles.emptyStateDescription}>
        {searchQuery 
          ? `No mentors match your search criteria.` 
          : `There are no mentors in the system yet.`}
      </Text>
    </View>
  );

  const renderShiftItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.shiftItem, 
        item.status === 'cancelled' && styles.cancelledShift
      ]}
      onPress={() => {
        setSelectedShift(item);
        // Show shift details or edit modal
      }}
      disabled={item.status === 'cancelled'}
    >
      <View style={styles.shiftInfo}>
        <Text style={styles.shiftDate}>{item.date}</Text>
        <Text style={styles.shiftTime}>{getFormattedShiftTime(item)}</Text>
        <Text style={styles.shiftType}>{item.type.toUpperCase()}</Text>
        {item.location && <Text style={styles.shiftLocation}>{item.location}</Text>}
      </View>
      
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => handleRemoveShift(item)}
        disabled={item.status === 'cancelled'}
      >
        <Ionicons 
          name="close-circle" 
          size={22} 
          color={item.status === 'cancelled' ? '#ccc' : '#e74c3c'} 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
  
  const renderNoShiftsMessage = () => (
    <View style={styles.noShiftsContainer}>
      <Text style={styles.noShiftsMessage}>No shifts assigned yet</Text>
      <TouchableOpacity
        style={styles.addShiftButton}
        onPress={() => setShiftModalVisible(true)}
      >
        <Text style={styles.addShiftButtonText}>Assign New Shift</Text>
      </TouchableOpacity>
    </View>
  );
  
  const renderLoadingIndicator = () => (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator size="large" color="goldenrod" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );

  // Add Shift Modal
  const AddShiftModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={shiftModalVisible}
      onRequestClose={() => setShiftModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedMentor 
                  ? `Assign Shift to ${selectedMentor.firstName}` 
                  : 'Assign New Shift'}
              </Text>
              <TouchableOpacity onPress={() => setShiftModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => setDatePickerVisible(true)}
              >
                <Text style={styles.dateText}>{newShift.date}</Text>
                <Ionicons name="calendar" size={20} color="#666" />
              </TouchableOpacity>
              
              {datePickerVisible && (
                <DateTimePicker
                  value={new Date(newShift.date)}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setDatePickerVisible(false);
                    if (selectedDate) {
                      setNewShift(prev => ({
                        ...prev,
                        date: format(selectedDate, 'yyyy-MM-dd')
                      }));
                    }
                  }}
                />
              )}
            </View>
            
            <View style={styles.timeContainer}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Start Time</Text>
                <TextInput
                  style={styles.input}
                  value={newShift.startTime}
                  onChangeText={(text) => setNewShift(prev => ({ ...prev, startTime: text }))}
                  placeholder="HH:MM"
                />
              </View>
              
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>End Time</Text>
                <TextInput
                  style={styles.input}
                  value={newShift.endTime}
                  onChangeText={(text) => setNewShift(prev => ({ ...prev, endTime: text }))}
                  placeholder="HH:MM"
                />
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Shift Type</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[
                    styles.radioOption,
                    newShift.type === 'regular' && styles.radioSelected
                  ]}
                  onPress={() => setNewShift(prev => ({ ...prev, type: 'regular' }))}
                >
                  <Text style={styles.radioText}>Regular</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.radioOption,
                    newShift.type === 'ra' && styles.radioSelected
                  ]}
                  onPress={() => setNewShift(prev => ({ ...prev, type: 'ra' }))}
                >
                  <Text style={styles.radioText}>RA Duty</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                value={newShift.location}
                onChangeText={(text) => setNewShift(prev => ({ ...prev, location: text }))}
                placeholder="Enter location"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newShift.notes}
                onChangeText={(text) => setNewShift(prev => ({ ...prev, notes: text }))}
                placeholder="Enter any additional notes"
                multiline
                numberOfLines={4}
              />
            </View>
            
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => {
                if (selectedMentor) {
                  handleAssignShift(selectedMentor);
                } else {
                  Alert.alert('Error', 'No mentor selected');
                }
              }}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitButtonText}>Assign Shift</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // Mentor Details Modal
  const MentorDetailsModal = () => {
    if (!selectedMentor) return null;
    
    const mentorShifts = getMentorShifts(selectedMentor.id);
    
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
                {selectedMentor.firstName} {selectedMentor.lastName}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Mentor Information</Text>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Email:</Text>
                <Text style={styles.detailValue}>{selectedMentor.email || 'N/A'}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phone:</Text>
                <Text style={styles.detailValue}>{selectedMentor.phone || 'N/A'}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Role:</Text>
                <Text style={styles.detailValue}>{selectedMentor.role || 'N/A'}</Text>
              </View>
            </View>
            
            <View style={styles.shiftsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Assigned Shifts</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => {
                    setModalVisible(false);
                    setTimeout(() => {
                      setShiftModalVisible(true);
                    }, 300);
                  }}
                >
                  <Ionicons name="add" size={22} color="white" />
                </TouchableOpacity>
              </View>
              
              {mentorShifts.length > 0 ? (
                <FlatList
                  data={mentorShifts}
                  renderItem={renderShiftItem}
                  keyExtractor={item => item.id}
                  style={styles.shiftsList}
                />
              ) : (
                renderNoShiftsMessage()
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Mentor Shifts</Text>
      </View>
      
      <View style={styles.dateSelector}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => {
            const prevDate = new Date(currentDate);
            prevDate.setDate(prevDate.getDate() - 1);
            setCurrentDate(prevDate);
          }}
        >
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.dateDisplay}
          onPress={() => setDatePickerVisible(true)}
        >
          <Text style={styles.dateText}>{format(currentDate, 'MMMM dd, yyyy')}</Text>
          <Ionicons name="calendar-outline" size={20} color="#666" style={styles.calendarIcon} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => {
            const nextDate = new Date(currentDate);
            nextDate.setDate(nextDate.getDate() + 1);
            setCurrentDate(nextDate);
          }}
        >
          <Ionicons name="chevron-forward" size={24} color="#333" />
        </TouchableOpacity>
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
        renderItem={renderMentorItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
      />
      
      {loading && renderLoadingIndicator()}
      
      <MentorDetailsModal />
      <AddShiftModal />
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
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    marginTop: 8,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  dateButton: {
    padding: 8,
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  calendarIcon: {
    marginLeft: 8,
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
    paddingBottom: 20,
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
    marginBottom: 8,
  },
  shiftsContainer: {
    marginTop: 4,
  },
  todayShiftsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 4,
  },
  shiftBadge: {
    backgroundColor: 'rgba(218, 165, 32, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  shiftBadgeText: {
    fontSize: 12,
    color: '#8B6914',
  },
  noShiftsText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
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
    flex: 1,
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
    width: '30%',
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  detailValue: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  shiftsSection: {
    flex: 1,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: 'goldenrod',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  shiftsList: {
    maxHeight: 300,
  },
  shiftItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelledShift: {
    backgroundColor: '#f9f9f9',
    borderColor: '#eee',
    opacity: 0.7,
  },
  shiftInfo: {
    flex: 1,
  },
  shiftDate: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  shiftTime: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  shiftType: {
    fontSize: 12,
    color: '#4a6ea9',
    fontWeight: '500',
    marginBottom: 2,
  },
  shiftLocation: {
    fontSize: 12,
    color: '#777',
  },
  removeButton: {
    padding: 4,
  },
  noShiftsContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  noShiftsMessage: {
    fontSize: 16,
    color: '#888',
    marginBottom: 16,
  },
  addShiftButton: {
    backgroundColor: '#4a6ea9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addShiftButtonText: {
    color: 'white',
    fontWeight: '500',
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
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginTop: 12,
  },
});

export default MentorScheduleScreen; 