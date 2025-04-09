import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  TextInput,
  SafeAreaView,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import demo data and helpers
import { MENTORS, STUDENTS } from '../../utils/demoData';
import { getInitials, truncateText } from '../../utils/helpers';

// Using first student as the current visitor
const currentStudent = STUDENTS[0];

const MentorsScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter mentors based on search query
  const filteredMentors = MENTORS.filter(mentor => 
    searchQuery === '' || 
    mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.biography.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Check if current student is assigned to this mentor
  const isMyMentor = (mentorId) => {
    return currentStudent.mentorId === mentorId;
  };
  
  const handleContactMentor = (email) => {
    Linking.openURL(`mailto:${email}`);
  };
  
  const handleViewProfile = (mentor) => {
    // Will navigate to mentor profile detail screen in future
    console.log('View mentor profile:', mentor.id);
  };
  
  const renderMentor = ({ item }) => {
    const isMine = isMyMentor(item.id);
    
    return (
      <TouchableOpacity 
        style={styles.mentorCard}
        onPress={() => handleViewProfile(item)}
      >
        {item.profileImageUrl ? (
          <Image source={{ uri: item.profileImageUrl }} style={styles.mentorImage} />
        ) : (
          <View style={styles.initialsContainer}>
            <Text style={styles.initials}>{getInitials(item.name)}</Text>
          </View>
        )}
        
        <View style={styles.mentorInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.mentorName}>{item.name}</Text>
            {isMine && (
              <View style={styles.myMentorBadge}>
                <Text style={styles.myMentorText}>My Mentor</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.department}>{item.department}</Text>
          <Text style={styles.biography}>{truncateText(item.biography, 100)}</Text>
          
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Ionicons name="people-outline" size={16} color="#666" />
              <Text style={styles.statText}>{item.students.length} Students</Text>
            </View>
          </View>
          
          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.contactButton]} 
              onPress={() => handleContactMentor(item.email)}
            >
              <Ionicons name="mail-outline" size={16} color="#fff" style={styles.actionIcon} />
              <Text style={styles.actionText}>Contact</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionButton, styles.scheduleButton]}>
              <Ionicons name="calendar-outline" size={16} color="#fff" style={styles.actionIcon} />
              <Text style={styles.actionText}>Schedule</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="people-outline" size={64} color="#ccc" />
      <Text style={styles.emptyStateTitle}>No mentors found</Text>
      <Text style={styles.emptyStateText}>
        Try adjusting your search criteria
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Mentors</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search mentors..."
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
        data={filteredMentors}
        renderItem={renderMentor}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.mentorsList}
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
  mentorsList: {
    padding: 16,
  },
  mentorCard: {
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
  mentorImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },
  initialsContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#4e73df',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  initials: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  mentorInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  mentorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  myMentorBadge: {
    backgroundColor: '#e8f4ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  myMentorText: {
    color: '#4e73df',
    fontSize: 12,
    fontWeight: '500',
  },
  department: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  biography: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  stats: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  contactButton: {
    backgroundColor: '#4e73df',
  },
  scheduleButton: {
    backgroundColor: '#f9a826',
  },
  actionIcon: {
    marginRight: 6,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
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

export default MentorsScreen; 