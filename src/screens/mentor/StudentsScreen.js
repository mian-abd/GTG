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
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

// Import helpers
import { getInitials } from '../../utils/helpers';

const StudentsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get demo student data - will be replaced with actual data from user context
  const mentorStudents = user?.students || [];
  
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
      style={[styles.studentCard, { 
        backgroundColor: theme.colors.card,
        borderColor: theme.colors.border
      }]}
      onPress={() => handleViewStudent(item)}
    >
      {item.profileImageUrl ? (
        <Image source={{ uri: item.profileImageUrl }} style={styles.studentImage} />
      ) : (
        <View style={[styles.initialsContainer, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.initials}>{getInitials(item.name)}</Text>
        </View>
      )}
      
      <View style={styles.studentInfo}>
        <Text style={[styles.studentName, { color: theme.colors.text.primary }]}>{item.name}</Text>
        <Text style={[styles.department, { color: theme.colors.text.secondary }]}>{item.department}</Text>
        
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.scheduleButton, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="calendar-outline" size={16} color="#fff" />
            <Text style={styles.actionText}>Schedule</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="people-outline" size={64} color={theme.colors.text.tertiary} />
      <Text style={[styles.emptyStateTitle, { color: theme.colors.text.primary }]}>No students found</Text>
      <Text style={[styles.emptyStateText, { color: theme.colors.text.secondary }]}>
        You don't have any students assigned to you yet or none match your search criteria.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <View style={[styles.header, { 
        backgroundColor: theme.colors.background.secondary,
        borderBottomColor: theme.colors.border
      }]}>
        <Text style={[styles.screenTitle, { color: theme.colors.text.primary }]}>My Students</Text>
      </View>
      
      <View style={[styles.searchContainer, { 
        backgroundColor: theme.colors.card,
        borderColor: theme.colors.border
      }]}>
        <Ionicons name="search-outline" size={20} color={theme.colors.text.tertiary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text.primary }]}
          placeholder="Search students..."
          placeholderTextColor={theme.colors.text.tertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={theme.colors.text.tertiary} />
          </TouchableOpacity>
        )}
      </View>
      
      <FlatList
        data={filteredStudents}
        renderItem={renderStudent}
        keyExtractor={item => item.id ? item.id.toString() : Math.random().toString()}
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
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  studentsList: {
    padding: 16,
  },
  studentCard: {
    flexDirection: 'row',
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
    fontWeight: 'bold',
    marginBottom: 4,
  },
  department: {
    fontSize: 14,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 12,
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: '#F9A826',
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default StudentsScreen; 