import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  SafeAreaView,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import demo data and helpers
import { MENTORS, STUDENTS } from '../../utils/demoData';
import { getInitials } from '../../utils/helpers';

// Using first mentor as the current mentor
const currentMentor = MENTORS[0];

const StudentsScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get students assigned to this mentor
  const mentorStudents = STUDENTS.filter(student => 
    student.mentorId === currentMentor.id
  );
  
  // Filter students based on search query
  const filteredStudents = mentorStudents.filter(student => 
    searchQuery === '' || 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.department.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleViewStudent = (student) => {
    // Will navigate to student details screen in future
    console.log('View student profile:', student.id);
  };
  
  const renderStudent = ({ item }) => (
    <TouchableOpacity 
      style={styles.studentCard}
      onPress={() => handleViewStudent(item)}
    >
      {item.profileImageUrl ? (
        <Image source={{ uri: item.profileImageUrl }} style={styles.studentImage} />
      ) : (
        <View style={styles.initialsContainer}>
          <Text style={styles.initials}>{getInitials(item.name)}</Text>
        </View>
      )}
      
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item.name}</Text>
        <Text style={styles.department}>{item.department}</Text>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBar, { width: `${item.progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{item.progress}% Complete</Text>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.actionButton, styles.messageButton]}>
            <Ionicons name="mail-outline" size={16} color="#fff" />
            <Text style={styles.actionText}>Message</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, styles.scheduleButton]}>
            <Ionicons name="calendar-outline" size={16} color="#fff" />
            <Text style={styles.actionText}>Schedule</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="people-outline" size={64} color="#ccc" />
      <Text style={styles.emptyStateTitle}>No students found</Text>
      <Text style={styles.emptyStateText}>
        You don't have any students assigned to you yet or none match your search criteria.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>My Students</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search students..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
      
      <FlatList
        data={filteredStudents}
        renderItem={renderStudent}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.studentsList}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
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
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e1e1',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },
  studentsList: {
    padding: 16,
  },
  studentCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  studentImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  initialsContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4e73df',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  initials: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  department: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4e73df',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
  },
  messageButton: {
    backgroundColor: '#4e73df',
  },
  scheduleButton: {
    backgroundColor: '#f9a826',
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});

export default StudentsScreen; 