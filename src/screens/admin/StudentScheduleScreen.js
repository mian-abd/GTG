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
  addDocument,
  queryDocuments 
} from '../../utils/firebaseConfig';

const StudentScheduleScreen = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [classModalVisible, setClassModalVisible] = useState(false);
  const [currentDay, setCurrentDay] = useState(1); // Day 1 or Day 2
  
  // Fixed schedule based on the provided data
  const fixedSchedule = {
    1: [ // Day 1
      { time: '9:00am - 9:30am', activity: 'Check-in' },
      { time: '9:30am - 10:30am', activity: 'Expectations & Breakfast with families' },
      { time: '10:30am - 11:30am', activity: 'Campus tour' },
      { time: '11:30am - 1:00pm', activity: 'Class', isClassSlot: true },
      { time: '1:00pm - 2:00pm', activity: 'Lunch with Campus Partners' },
      { time: '2:00pm - 3:30pm', activity: 'Class', isClassSlot: true },
      { time: '3:30pm - 4:00pm', activity: 'Break at Residence Hall' },
      { time: '4:00pm - 5:30pm', activity: 'Class', isClassSlot: true },
      { time: '5:30pm - 6:30pm', activity: 'Dinner with Alumni' },
      { time: '6:30pm - 9:00pm', activity: 'Recreation (Scoops, the Farm, Movies)' },
      { time: '9:00pm - 10:30pm', activity: 'Programming and Pizza' },
      { time: '10:30pm - 11:00pm', activity: 'Wind down and lights out' }
    ],
    2: [ // Day 2
      { time: '9:30am - 10:30am', activity: 'Breakfast' },
      { time: '10:30am - 12:00pm', activity: 'Class', isClassSlot: true },
      { time: '12:00pm - 1:00pm', activity: 'Lunch' },
      { time: '1:00pm - 2:30pm', activity: 'Class', isClassSlot: true },
      { time: '2:30pm - 3:00pm', activity: 'Debrief with student participants' },
      { time: '3:00pm - 3:30pm', activity: 'Students pack up and depart campus' }
    ]
  };

  // Hardcoded class data from the spreadsheet
  const classData = [
    { id: '1', name: 'Art of Living Well', instructor: 'Amity Reading', date: 'June 19th', time: '11:30am - 1:00pm' },
    { id: '2', name: 'Discovering Your Gold Within: How to Shine Through the College Admission Process', instructor: 'Taylor Malsyer', date: 'June 19th', time: '11:30am - 1:00pm' },
    { id: '3', name: 'Inspire to Inspire: The Human Lung/Heart Machine', instructor: 'Jacqueline Woodis', date: 'June 19th', time: '11:30am - 1:00pm' },
    { id: '4', name: 'Mind your Media: The Importance of Media Literacy', instructor: 'Renee Thomas-Woodis', date: 'June 19th', time: '11:30am - 1:00pm' },
    { id: '5', name: 'Equity and Inclusion in Sport', instructor: 'Steve Baker-Watson', date: 'June 19th', time: '11:30am - 1:00pm' },
    { id: '6', name: 'Art of Living Well', instructor: 'Amity Reading', date: 'June 19th', time: '2:00pm - 3:30pm' },
    { id: '7', name: 'Inspire to Inspire: The Human Lung/Heart Machine', instructor: 'Jacqueline Woodis', date: 'June 19th', time: '2:00pm - 3:30pm' },
    { id: '8', name: 'Mind your Media: The Importance of Media Literacy', instructor: 'Renee Thomas-Woodis', date: 'June 19th', time: '2:00pm - 3:30pm' },
    { id: '9', name: 'Video Editing and Post-Production', instructor: 'Danae Yun', date: 'June 19th', time: '2:00pm - 3:30pm' },
    { id: '10', name: 'Information Spread across Social Networks: A Friendly Journey', instructor: 'Suman Balasubramanian', date: 'June 19th', time: '2:00pm - 3:30pm' },
    { id: '11', name: 'Equity and Inclusion in Sport', instructor: 'Steve Baker-Watson', date: 'June 23rd', time: '10:30am - 12:00pm' },
    { id: '12', name: 'Social Media and Culture', instructor: 'Thosar Yun', date: 'June 23rd', time: '10:30am - 12:00pm' },
    { id: '13', name: 'Costume Design & Fashion for Film, Theatre, & Video Games', instructor: 'Caroline Good', date: 'June 23rd', time: '10:30am - 12:00pm' },
    { id: '14', name: 'Please Soil Me', instructor: 'Dassa Frank', date: 'June 23rd', time: '10:30am - 12:00pm' },
    { id: '15', name: 'Discovering Your Gold Within: How to Shine Through the College Admission Process', instructor: 'Taylor Malsyer', date: 'June 26th', time: '11:30am - 1:00pm' },
    { id: '16', name: 'Thriving Through College: A Blueprint for Success & Well-Being', instructor: 'Stephanie Jefferson', date: 'June 26th', time: '11:30am - 1:00pm' },
    { id: '17', name: 'Our Place in the Stars', instructor: 'Avery Archer', date: 'June 26th', time: '11:30am - 1:00pm' },
    { id: '18', name: 'Information Spread across Social Networks: A Friendly Journey', instructor: 'Suman Balasubramanian', date: 'June 26th', time: '11:30am - 1:00pm' },
    { id: '19', name: 'A Song Worth Singing: Telling Musical Stories to Yourself and Others', instructor: 'Ron Dye', date: 'June 26th', time: '11:30am - 1:00pm' },
    { id: '20', name: 'Costume Design & Fashion for Film, Theatre, & Video Games', instructor: 'Caroline Good', date: 'June 26th-July 1st', time: 'Various' },
    { id: '21', name: 'Innovations in Action: Crafting and Marketing Your Startup Business', instructor: 'Amy Elzemerokha', date: 'June 30th-July 1st', time: 'Various' },
    { id: '22', name: 'Our Place in the Stars', instructor: 'Avery Archer', date: 'June 30th-July 1st', time: 'Various' },
    { id: '23', name: 'A Song Worth Singing: Telling Musical Stories to Yourself and Others', instructor: 'Ron Dye', date: 'June 30th-July 1st', time: 'Various' },
    { id: '24', name: 'Inventing: from Idea to Product', instructor: 'Jacob Hale', date: 'June 30th-July 1st', time: 'Various' }
  ];

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = students.filter(student => {
        const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
      });
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchQuery, students]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const fetchedStudents = await getDocuments('students');
      
      if (fetchedStudents && fetchedStudents.length > 0) {
        setStudents(fetchedStudents);
        setFilteredStudents(fetchedStudents);
      } else {
        // If no students found, you might want to show a message or use mock data
        setStudents([]);
        setFilteredStudents([]);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      Alert.alert('Error', 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const fetchedClasses = await getDocuments('classes');
      
      if (fetchedClasses && fetchedClasses.length > 0) {
        setClasses(fetchedClasses);
      } else {
        // If no classes found in Firebase, use the hardcoded class data
        // In a real app, you would add these to Firebase
        setClasses(classData);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      // Fall back to hardcoded class data
      setClasses(classData);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignClass = async (student, classObj, timeSlot) => {
    if (!student || !classObj) {
      Alert.alert('Error', 'Student or class information is missing');
      return;
    }

    try {
      setLoading(true);
      
      // Create a class assignment object
      const assignment = {
        classId: classObj.id,
        className: classObj.name,
        instructor: classObj.instructor,
        date: classObj.date,
        time: classObj.time || timeSlot,
        assignedAt: new Date().toISOString()
      };
      
      // Update student's schedule in Firebase
      if (!student.schedule) {
        student.schedule = {};
      }
      
      if (!student.schedule.classes) {
        student.schedule.classes = [];
      }
      
      // Check if already assigned to a class at this time slot
      const existingAssignmentIndex = student.schedule.classes.findIndex(
        c => c.time === assignment.time && c.date === assignment.date
      );
      
      if (existingAssignmentIndex >= 0) {
        // Replace existing assignment
        student.schedule.classes[existingAssignmentIndex] = assignment;
      } else {
        // Add new assignment
        student.schedule.classes.push(assignment);
      }
      
      // Update in Firebase
      await updateDocument('students', student.id, {
        schedule: student.schedule
      });
      
      // Update local state
      setStudents(prev => 
        prev.map(s => 
          s.id === student.id 
            ? { ...s, schedule: student.schedule }
            : s
        )
      );
      
      // Update filtered students too
      setFilteredStudents(prev => 
        prev.map(s => 
          s.id === student.id 
            ? { ...s, schedule: student.schedule }
            : s
        )
      );
      
      setClassModalVisible(false);
      setModalVisible(false);
      
      Alert.alert('Success', `${classObj.name} assigned to ${student.firstName} ${student.lastName}`);
    } catch (error) {
      console.error('Error assigning class:', error);
      Alert.alert('Error', 'Failed to assign class');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveClassAssignment = async (student, assignment) => {
    try {
      setLoading(true);
      
      // Filter out the assignment to remove
      const updatedClasses = student.schedule.classes.filter(
        c => !(c.classId === assignment.classId && c.time === assignment.time)
      );
      
      // Update student's schedule
      const updatedSchedule = {
        ...student.schedule,
        classes: updatedClasses
      };
      
      // Update in Firebase
      await updateDocument('students', student.id, {
        schedule: updatedSchedule
      });
      
      // Update local state
      setStudents(prev => 
        prev.map(s => 
          s.id === student.id 
            ? { ...s, schedule: updatedSchedule }
            : s
        )
      );
      
      // Update filtered students too
      setFilteredStudents(prev => 
        prev.map(s => 
          s.id === student.id 
            ? { ...s, schedule: updatedSchedule }
            : s
        )
      );
      
      Alert.alert('Success', 'Class assignment removed');
    } catch (error) {
      console.error('Error removing class assignment:', error);
      Alert.alert('Error', 'Failed to remove class assignment');
    } finally {
      setLoading(false);
    }
  };

  const renderStudentItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemCard}
      onPress={() => {
        setSelectedStudent(item);
        setModalVisible(true);
      }}
    >
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.firstName} {item.lastName}</Text>
        <Text style={styles.itemDetail}>
          {item.studentId ? `ID: ${item.studentId}` : 'No ID assigned'}
        </Text>
        
        {item.schedule && item.schedule.classes && item.schedule.classes.length > 0 ? (
          <View style={styles.classesContainer}>
            <Text style={styles.classesTitle}>Assigned Classes:</Text>
            {item.schedule.classes.slice(0, 2).map((cls, index) => (
              <View key={index} style={styles.classBadge}>
                <Text style={styles.classBadgeText}>
                  {cls.className} ({cls.time})
                </Text>
              </View>
            ))}
            {item.schedule.classes.length > 2 && (
              <Text style={styles.moreClassesText}>
                +{item.schedule.classes.length - 2} more classes
              </Text>
            )}
          </View>
        ) : (
          <Text style={styles.noClassesText}>No classes assigned yet</Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={24} color="gray" />
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="school-outline" size={64} color="#ccc" />
      <Text style={styles.emptyStateTitle}>No Students Found</Text>
      <Text style={styles.emptyStateDescription}>
        {searchQuery 
          ? `No students match your search criteria.` 
          : `There are no students in the system yet.`}
      </Text>
    </View>
  );
  
  const renderFixedScheduleItem = ({ item, index }) => {
    if (!selectedStudent) return null;
    
    // Find if student has a class assigned at this time slot
    const assignedClass = selectedStudent.schedule?.classes?.find(
      cls => cls.time === item.time && (cls.date?.includes(currentDay === 1 ? 'June 19th' : 'June 23rd'))
    );
    
    return (
      <View style={styles.scheduleItem}>
        <View style={styles.timeSlot}>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        
        <View style={[
          styles.activitySlot,
          item.isClassSlot && !assignedClass && styles.classSlotEmpty,
          item.isClassSlot && assignedClass && styles.classSlotFilled
        ]}>
          {item.isClassSlot && !assignedClass ? (
            <>
              <Text style={styles.activityText}>Class Time - Not Assigned</Text>
              <TouchableOpacity
                style={styles.assignButton}
                onPress={() => {
                  setSelectedClass(null);
                  setClassModalVisible(true);
                }}
              >
                <Text style={styles.assignButtonText}>Assign</Text>
              </TouchableOpacity>
            </>
          ) : item.isClassSlot && assignedClass ? (
            <>
              <View style={styles.assignedClassInfo}>
                <Text style={styles.assignedClassName}>{assignedClass.className}</Text>
                <Text style={styles.assignedClassDetail}>
                  Instructor: {assignedClass.instructor}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => {
                  Alert.alert(
                    'Remove Class',
                    `Are you sure you want to remove ${assignedClass.className}?`,
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { 
                        text: 'Remove', 
                        style: 'destructive',
                        onPress: () => handleRemoveClassAssignment(selectedStudent, assignedClass)
                      }
                    ]
                  );
                }}
              >
                <Ionicons name="close-circle" size={20} color="#e74c3c" />
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.activityText}>{item.activity}</Text>
          )}
        </View>
      </View>
    );
  };
  
  const renderClassItem = ({ item }) => {
    // Skip classes that don't match the current day
    if (currentDay === 1 && !item.date.includes('June 19th')) {
      return null;
    }
    if (currentDay === 2 && !item.date.includes('June 23rd')) {
      return null;
    }
    
    return (
      <TouchableOpacity 
        style={styles.classCard}
        onPress={() => {
          setSelectedClass(item);
          handleAssignClass(selectedStudent, item, selectedClass?.time);
        }}
      >
        <View style={styles.classInfo}>
          <Text style={styles.className}>{item.name}</Text>
          <Text style={styles.classInstructor}>
            Instructor: {item.instructor}
          </Text>
          <Text style={styles.classTime}>
            {item.date}, {item.time}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderFilteredClasses = () => {
    // Filter classes based on selected time slot
    const timeSlot = fixedSchedule[currentDay].find(
      slot => slot.isClassSlot && 
        !selectedStudent.schedule?.classes?.some(
          cls => cls.time === slot.time && (cls.date?.includes(currentDay === 1 ? 'June 19th' : 'June 23rd'))
        )
    );
    
    if (!timeSlot) return null;
    
    const filteredClasses = classes.filter(cls => {
      // Find classes that match the current day and are available at the selected time slot
      return (
        (currentDay === 1 && cls.date.includes('June 19th') && cls.time === timeSlot.time) ||
        (currentDay === 2 && cls.date.includes('June 23rd') && cls.time === timeSlot.time)
      );
    });
    
    return (
      <View style={styles.filteredClassesContainer}>
        <Text style={styles.availableClassesTitle}>
          Available Classes for {timeSlot.time}:
        </Text>
        {filteredClasses.length > 0 ? (
          <FlatList
            data={filteredClasses}
            renderItem={renderClassItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.classListContainer}
          />
        ) : (
          <Text style={styles.noClassesMessage}>
            No classes available for this time slot
          </Text>
        )}
      </View>
    );
  };
  
  const renderLoadingIndicator = () => (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator size="large" color="goldenrod" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );

  // Class Selection Modal
  const ClassSelectionModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={classModalVisible}
      onRequestClose={() => setClassModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Select a Class
            </Text>
            <TouchableOpacity onPress={() => setClassModalVisible(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          {renderFilteredClasses()}
        </View>
      </View>
    </Modal>
  );

  // Student Details Modal
  const StudentDetailsModal = () => {
    if (!selectedStudent) return null;
    
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
                {selectedStudent.firstName} {selectedStudent.lastName}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Student Information</Text>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Email:</Text>
                <Text style={styles.detailValue}>{selectedStudent.email || 'N/A'}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phone:</Text>
                <Text style={styles.detailValue}>{selectedStudent.phone || 'N/A'}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Student ID:</Text>
                <Text style={styles.detailValue}>{selectedStudent.studentId || 'N/A'}</Text>
              </View>
              
              {selectedStudent.guardian && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Guardian:</Text>
                  <Text style={styles.detailValue}>{selectedStudent.guardian || 'N/A'}</Text>
                </View>
              )}
            </View>
            
            <View style={styles.scheduleSection}>
              <View style={styles.daySelector}>
                <TouchableOpacity
                  style={[styles.dayTab, currentDay === 1 && styles.activeDayTab]}
                  onPress={() => setCurrentDay(1)}
                >
                  <Text style={[styles.dayTabText, currentDay === 1 && styles.activeDayTabText]}>
                    Day 1
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.dayTab, currentDay === 2 && styles.activeDayTab]}
                  onPress={() => setCurrentDay(2)}
                >
                  <Text style={[styles.dayTabText, currentDay === 2 && styles.activeDayTabText]}>
                    Day 2
                  </Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.scheduleTitle}>
                {currentDay === 1 ? 'Day 1 Schedule' : 'Day 2 Schedule'}
              </Text>
              
              <FlatList
                data={fixedSchedule[currentDay]}
                renderItem={renderFixedScheduleItem}
                keyExtractor={(item, index) => `${item.time}-${index}`}
                style={styles.scheduleList}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Student Class Assignments</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search students..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <FlatList
        data={filteredStudents}
        renderItem={renderStudentItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
      />
      
      {loading && renderLoadingIndicator()}
      
      <StudentDetailsModal />
      <ClassSelectionModal />
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
  classesContainer: {
    marginTop: 4,
  },
  classesTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 4,
  },
  classBadge: {
    backgroundColor: 'rgba(74, 110, 169, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  classBadgeText: {
    fontSize: 12,
    color: '#4a6ea9',
  },
  moreClassesText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  noClassesText: {
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
    maxHeight: '90%',
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
  scheduleSection: {
    flex: 1,
  },
  daySelector: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dayTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  activeDayTab: {
    backgroundColor: 'goldenrod',
  },
  dayTabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
  },
  activeDayTabText: {
    color: 'white',
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  scheduleList: {
    maxHeight: 400,
  },
  scheduleItem: {
    flexDirection: 'row',
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  timeSlot: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    width: 100,
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#555',
  },
  activitySlot: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  classSlotEmpty: {
    backgroundColor: '#fff9e6',
  },
  classSlotFilled: {
    backgroundColor: '#e6f7ff',
  },
  activityText: {
    fontSize: 14,
    color: '#333',
  },
  assignButton: {
    backgroundColor: '#4a6ea9',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  assignButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  assignedClassInfo: {
    flex: 1,
  },
  assignedClassName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  assignedClassDetail: {
    fontSize: 12,
    color: '#666',
  },
  removeButton: {
    padding: 4,
  },
  filteredClassesContainer: {
    flex: 1,
  },
  availableClassesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  classListContainer: {
    paddingBottom: 20,
  },
  classCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  classInstructor: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  classTime: {
    fontSize: 12,
    color: '#888',
  },
  noClassesMessage: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
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

export default StudentScheduleScreen; 