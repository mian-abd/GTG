import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  FlatList,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import demo data and helpers
import { MENTORS, STUDENTS } from '../../utils/demoData';
import { getInitials } from '../../utils/helpers';

const MentorDetailsScreen = ({ navigation, route }) => {
  // Get mentor by ID from params, or use first mentor as default
  const mentorId = route.params?.mentorId || MENTORS[0].id;
  const mentorDetails = MENTORS.find(mentor => mentor.id === mentorId) || MENTORS[0];
  
  // State for the active tab (about / students)
  const [activeTab, setActiveTab] = useState('about');
  
  // Get students assigned to this mentor
  const mentorStudents = STUDENTS.filter(student => 
    mentorDetails.students.includes(student.id)
  );
  
  const handleContactMentor = () => {
    Linking.openURL(`mailto:${mentorDetails.email}`);
  };
  
  const handleScheduleMeeting = () => {
    // In a real app, this would navigate to scheduling screen
    console.log('Schedule meeting with:', mentorDetails.name);
  };
  
  const renderStudentItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.studentCard}
      onPress={() => console.log('View student profile:', item.id)}
    >
      {item.profileImageUrl ? (
        <Image source={{ uri: item.profileImageUrl }} style={styles.studentImage} />
      ) : (
        <View style={styles.studentInitialsContainer}>
          <Text style={styles.studentInitials}>{getInitials(item.name)}</Text>
        </View>
      )}
      
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item.name}</Text>
        <Text style={styles.studentDepartment}>{item.department}</Text>
      </View>
      
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );
  
  const renderAboutTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Biography</Text>
        <Text style={styles.biographyText}>{mentorDetails.biography}</Text>
      </View>
      
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Department</Text>
        <View style={styles.departmentContainer}>
          <Ionicons name="business-outline" size={18} color="#666" style={styles.infoIcon} />
          <Text style={styles.departmentText}>{mentorDetails.department}</Text>
        </View>
      </View>
      
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <TouchableOpacity 
          style={styles.contactRow}
          onPress={handleContactMentor}
        >
          <Ionicons name="mail-outline" size={18} color="#666" style={styles.infoIcon} />
          <Text style={styles.contactText}>{mentorDetails.email}</Text>
          <Ionicons name="open-outline" size={16} color="#4e73df" />
        </TouchableOpacity>
      </View>
    </View>
  );
  
  const renderStudentsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.studentCountText}>
        Mentoring {mentorStudents.length} student{mentorStudents.length !== 1 ? 's' : ''}
      </Text>
      
      <FlatList
        data={mentorStudents}
        renderItem={renderStudentItem}
        keyExtractor={item => item.id.toString()}
        scrollEnabled={false}
        ListEmptyComponent={
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>No students assigned to this mentor yet.</Text>
          </View>
        }
      />
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mentor Profile</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          {mentorDetails.profileImageUrl ? (
            <Image source={{ uri: mentorDetails.profileImageUrl }} style={styles.profileImage} />
          ) : (
            <View style={styles.initialsContainer}>
              <Text style={styles.initials}>{getInitials(mentorDetails.name)}</Text>
            </View>
          )}
          
          <Text style={styles.mentorName}>{mentorDetails.name}</Text>
          <Text style={styles.mentorDepartment}>{mentorDetails.department}</Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.contactButton]}
              onPress={handleContactMentor}
            >
              <Ionicons name="mail-outline" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Contact</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.scheduleButton]}
              onPress={handleScheduleMeeting}
            >
              <Ionicons name="calendar-outline" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Schedule</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'about' && styles.activeTab]}
            onPress={() => setActiveTab('about')}
          >
            <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>About</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'students' && styles.activeTab]}
            onPress={() => setActiveTab('students')}
          >
            <Text style={[styles.tabText, activeTab === 'students' && styles.activeTabText]}>
              Students ({mentorStudents.length})
            </Text>
          </TouchableOpacity>
        </View>
        
        {activeTab === 'about' ? renderAboutTab() : renderStudentsTab()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  initialsContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4e73df',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  initials: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  mentorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  mentorDepartment: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    width: '45%',
  },
  contactButton: {
    backgroundColor: '#4e73df',
  },
  scheduleButton: {
    backgroundColor: '#f9a826',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4e73df',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#999',
  },
  activeTabText: {
    color: '#4e73df',
  },
  tabContent: {
    padding: 16,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  biographyText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  departmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 8,
  },
  departmentText: {
    fontSize: 16,
    color: '#666',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactText: {
    flex: 1,
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  studentCountText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  studentImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  studentInitialsContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentInitials: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  studentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  studentDepartment: {
    fontSize: 14,
    color: '#999',
  },
  emptyStateContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default MentorDetailsScreen; 