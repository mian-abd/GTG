import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import demo data and helper functions
import { STUDENTS, CLASSES } from '../../utils/demoData';
import { getInitials, formatDate } from '../../utils/helpers';

const StudentDetailScreen = ({ route, navigation }) => {
  // In a real app, this would come from the route params
  // For now, just use the first student as an example
  const studentId = route.params?.studentId || STUDENTS[0].id;
  const student = STUDENTS.find(s => s.id === studentId) || STUDENTS[0];
  
  const [activeTab, setActiveTab] = useState('overview');
  
  // Get student's classes
  const studentClasses = CLASSES.filter(cls => 
    student.classSchedule && student.classSchedule.includes(cls.id)
  );
  
  // Function to render the student's basic information
  const renderOverview = () => (
    <View>
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <View style={styles.infoRow}>
          <View style={styles.infoLabelContainer}>
            <Ionicons name="mail-outline" size={18} color="#666" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Email</Text>
          </View>
          <Text style={styles.infoValue}>{student.email}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <View style={styles.infoLabelContainer}>
            <Ionicons name="school-outline" size={18} color="#666" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Department</Text>
          </View>
          <Text style={styles.infoValue}>{student.department}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <View style={styles.infoLabelContainer}>
            <Ionicons name="pin-outline" size={18} color="#666" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Room</Text>
          </View>
          <Text style={styles.infoValue}>{student.roomNumber || student.roomAssignment || 'Not assigned'}</Text>
        </View>
      </View>
      
      <View style={styles.progressSection}>
        <Text style={styles.sectionTitle}>Academic Progress</Text>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${student.progress || 0}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{student.progress || 0}% Complete</Text>
        </View>
        
        <View style={styles.progressStats}>
          <View style={styles.progressStat}>
            <Text style={styles.progressStatValue}>8</Text>
            <Text style={styles.progressStatLabel}>Completed</Text>
          </View>
          
          <View style={styles.progressStat}>
            <Text style={styles.progressStatValue}>3</Text>
            <Text style={styles.progressStatLabel}>In Progress</Text>
          </View>
          
          <View style={styles.progressStat}>
            <Text style={styles.progressStatValue}>2</Text>
            <Text style={styles.progressStatLabel}>Upcoming</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.notesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <TouchableOpacity>
            <Ionicons name="add-circle-outline" size={22} color="#4e73df" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.noteItem}>
          <View style={styles.noteHeader}>
            <Text style={styles.noteDate}>April 5, 2023</Text>
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal" size={18} color="#999" />
            </TouchableOpacity>
          </View>
          <Text style={styles.noteText}>
            Sarah is making excellent progress on her research project. 
            We discussed potential methods for data analysis and decided on using R for statistical testing.
          </Text>
        </View>
        
        <View style={styles.noteItem}>
          <View style={styles.noteHeader}>
            <Text style={styles.noteDate}>March 22, 2023</Text>
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal" size={18} color="#999" />
            </TouchableOpacity>
          </View>
          <Text style={styles.noteText}>
            Initial meeting to discuss thesis topic. Sarah is interested in pursuing research on environmental impact 
            of urban development. I suggested several recent papers for her to review before our next meeting.
          </Text>
        </View>
      </View>
      
      <View style={styles.emergencySection}>
        <Text style={styles.sectionTitle}>Emergency Information</Text>
        
        <View style={styles.emergencyInfo}>
          <View style={styles.emergencyContact}>
            <Text style={styles.emergencyLabel}>Emergency Contact</Text>
            <Text style={styles.emergencyName}>
              {student.emergencyContact?.name || 'Not provided'}
            </Text>
            <Text style={styles.emergencyRelation}>
              {student.emergencyContact?.relationship || ''} • {student.emergencyContact?.phone || 'No phone'}
            </Text>
          </View>
          
          <View style={styles.medicalInfo}>
            <Text style={styles.emergencyLabel}>Medical Information</Text>
            <Text style={styles.medicalText}>
              {student.medicalInfo || 'No medical information provided'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
  
  // Function to render the student's classes
  const renderClasses = () => (
    <View style={styles.classesContainer}>
      {studentClasses.length > 0 ? (
        studentClasses.map(cls => (
          <View key={cls.id} style={styles.classItem}>
            <View style={styles.classHeader}>
              <Text style={styles.className}>{cls.name}</Text>
              <View style={styles.classTagContainer}>
                <Text style={styles.classTag}>{cls.id.toUpperCase()}</Text>
              </View>
            </View>
            
            <View style={styles.classDetails}>
              <View style={styles.classDetailRow}>
                <Ionicons name="person-outline" size={16} color="#666" style={styles.classIcon} />
                <Text style={styles.classDetailText}>{cls.instructor}</Text>
              </View>
              
              <View style={styles.classDetailRow}>
                <Ionicons name="time-outline" size={16} color="#666" style={styles.classIcon} />
                <Text style={styles.classDetailText}>
                  {formatDate(cls.schedule.date, 'short')} at {cls.schedule.time}
                </Text>
              </View>
              
              <View style={styles.classDetailRow}>
                <Ionicons name="location-outline" size={16} color="#666" style={styles.classIcon} />
                <Text style={styles.classDetailText}>{cls.location}</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.viewClassButton}>
              <Text style={styles.viewClassText}>View Class Details</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="school-outline" size={48} color="#ccc" />
          <Text style={styles.emptyStateTitle}>No Classes Found</Text>
          <Text style={styles.emptyStateText}>This student is not enrolled in any classes.</Text>
        </View>
      )}
    </View>
  );
  
  // Function to render attendance information
  const renderAttendance = () => (
    <View style={styles.attendanceContainer}>
      <View style={styles.attendanceSummary}>
        <View style={styles.attendanceStat}>
          <Text style={styles.attendanceStatValue}>92%</Text>
          <Text style={styles.attendanceStatLabel}>Overall</Text>
        </View>
        
        <View style={styles.attendanceStat}>
          <Text style={styles.attendanceStatValue}>23</Text>
          <Text style={styles.attendanceStatLabel}>Present</Text>
        </View>
        
        <View style={styles.attendanceStat}>
          <Text style={styles.attendanceStatValue}>2</Text>
          <Text style={styles.attendanceStatLabel}>Absent</Text>
        </View>
        
        <View style={styles.attendanceStat}>
          <Text style={styles.attendanceStatValue}>1</Text>
          <Text style={styles.attendanceStatLabel}>Late</Text>
        </View>
      </View>
      
      <View style={styles.attendanceList}>
        <Text style={styles.attendanceTitle}>Recent Attendance</Text>
        
        <View style={styles.attendanceItem}>
          <View style={styles.attendanceLeft}>
            <View style={[styles.attendanceStatus, styles.presentStatus]} />
            <View>
              <Text style={styles.attendanceClass}>Introduction to Psychology</Text>
              <Text style={styles.attendanceDate}>April 6, 2023 - 10:00 AM</Text>
            </View>
          </View>
          <Text style={styles.attendanceStatusText}>Present</Text>
        </View>
        
        <View style={styles.attendanceItem}>
          <View style={styles.attendanceLeft}>
            <View style={[styles.attendanceStatus, styles.presentStatus]} />
            <View>
              <Text style={styles.attendanceClass}>Research Methods</Text>
              <Text style={styles.attendanceDate}>April 5, 2023 - 2:30 PM</Text>
            </View>
          </View>
          <Text style={styles.attendanceStatusText}>Present</Text>
        </View>
        
        <View style={styles.attendanceItem}>
          <View style={styles.attendanceLeft}>
            <View style={[styles.attendanceStatus, styles.lateStatus]} />
            <View>
              <Text style={styles.attendanceClass}>Statistics for Social Sciences</Text>
              <Text style={styles.attendanceDate}>April 4, 2023 - 9:00 AM</Text>
            </View>
          </View>
          <Text style={[styles.attendanceStatusText, styles.lateStatusText]}>Late (10 min)</Text>
        </View>
        
        <View style={styles.attendanceItem}>
          <View style={styles.attendanceLeft}>
            <View style={[styles.attendanceStatus, styles.absentStatus]} />
            <View>
              <Text style={styles.attendanceClass}>Cognitive Psychology</Text>
              <Text style={styles.attendanceDate}>April 3, 2023 - 1:15 PM</Text>
            </View>
          </View>
          <Text style={[styles.attendanceStatusText, styles.absentStatusText]}>Absent</Text>
        </View>
      </View>
    </View>
  );

  // Render appropriate content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'classes':
        return renderClasses();
      case 'attendance':
        return renderAttendance();
      default:
        return renderOverview();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Student Profile</Text>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Student Profile Header */}
        <View style={styles.profileHeader}>
          {student.profileImageUrl ? (
            <Image 
              source={{ uri: student.profileImageUrl }} 
              style={styles.profileImage} 
            />
          ) : (
            <View style={styles.profileImageFallback}>
              <Text style={styles.profileImageText}>
                {getInitials(student.name)}
              </Text>
            </View>
          )}
          
          <View style={styles.profileInfo}>
            <Text style={styles.studentName}>{student.name}</Text>
            <Text style={styles.studentId}>Student ID: {student.id}</Text>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.profileActionButton}
                onPress={() => console.log('Message student')}
              >
                <Ionicons name="chatbubble-outline" size={16} color="#fff" />
                <Text style={styles.profileActionText}>Message</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.profileActionButton, styles.scheduleButton]}
                onPress={() => console.log('Schedule meeting')}
              >
                <Ionicons name="calendar-outline" size={16} color="#fff" />
                <Text style={styles.profileActionText}>Schedule</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        {/* Tabs navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
            onPress={() => setActiveTab('overview')}
          >
            <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
              Overview
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'classes' && styles.activeTab]}
            onPress={() => setActiveTab('classes')}
          >
            <Text style={[styles.tabText, activeTab === 'classes' && styles.activeTabText]}>
              Classes
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'attendance' && styles.activeTab]}
            onPress={() => setActiveTab('attendance')}
          >
            <Text style={[styles.tabText, activeTab === 'attendance' && styles.activeTabText]}>
              Attendance
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Dynamic content based on active tab */}
        <View style={styles.tabContent}>
          {renderContent()}
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  actionButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileImageFallback: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4e73df',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileImageText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  studentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  studentId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  profileActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4e73df',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
  },
  scheduleButton: {
    backgroundColor: '#2ecc71',
  },
  profileActionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4e73df',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#4e73df',
  },
  tabContent: {
    padding: 16,
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
  },
  progressSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4e73df',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressStat: {
    alignItems: 'center',
  },
  progressStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  progressStatLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  notesSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  noteItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteDate: {
    fontSize: 12,
    color: '#888',
  },
  noteText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  emergencySection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  emergencyInfo: {
    flexDirection: 'row',
  },
  emergencyContact: {
    flex: 1,
    marginRight: 8,
  },
  medicalInfo: {
    flex: 1,
    marginLeft: 8,
  },
  emergencyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emergencyName: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  emergencyRelation: {
    fontSize: 12,
    color: '#666',
  },
  medicalText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  classesContainer: {
    marginBottom: 16,
  },
  classItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  className: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  classTagContainer: {
    backgroundColor: '#e8eeff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  classTag: {
    fontSize: 12,
    color: '#4e73df',
    fontWeight: '500',
  },
  classDetails: {
    marginBottom: 12,
  },
  classDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  classIcon: {
    marginRight: 8,
  },
  classDetailText: {
    fontSize: 14,
    color: '#666',
  },
  viewClassButton: {
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: '#4e73df',
    borderRadius: 4,
  },
  viewClassText: {
    fontSize: 14,
    color: '#4e73df',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  emptyStateTitle: {
    fontSize: 16,
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
  attendanceContainer: {
    marginBottom: 16,
  },
  attendanceSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  attendanceStat: {
    alignItems: 'center',
  },
  attendanceStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  attendanceStatLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  attendanceList: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  attendanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  attendanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  attendanceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  attendanceStatus: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  presentStatus: {
    backgroundColor: '#2ecc71',
  },
  lateStatus: {
    backgroundColor: '#f9a826',
  },
  absentStatus: {
    backgroundColor: '#e74c3c',
  },
  attendanceClass: {
    fontSize: 14,
    color: '#333',
  },
  attendanceDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  attendanceStatusText: {
    fontSize: 14,
    color: '#2ecc71',
    fontWeight: '500',
  },
  lateStatusText: {
    color: '#f9a826',
  },
  absentStatusText: {
    color: '#e74c3c',
  },
});

export default StudentDetailScreen; 