import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  TextInput,
  SafeAreaView,
  Linking,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { getDocuments } from '../../utils/firebaseConfig';
import { COLORS } from '../../assets';

// Import helpers
import { getInitials, truncateText } from '../../utils/helpers';

const MentorsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStudent, setCurrentStudent] = useState(null);
  
  // Define styles inside the component to have access to theme
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 10,
    },
    screenTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      marginLeft: 6,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 6,
      marginHorizontal: 16,
      marginVertical: 8,
    },
    searchIcon: {
      marginRight: 6,
    },
    searchInput: {
      flex: 1,
      height: 32,
      fontSize: 14,
    },
    clearButton: {
      padding: 4,
    },
    mentorsList: {
      padding: 10,
      paddingTop: 4,
    },
    mentorCard: {
      borderRadius: 10,
      marginBottom: 8,
      padding: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 2,
      elevation: 1,
    },
    mentorHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    mentorImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    initialsContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    initials: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    mentorTitleContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    mentorName: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 1,
    },
    myMentorBadge: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 8,
      marginLeft: 6,
      marginRight: 6,
    },
    myMentorText: {
      fontSize: 10,
      fontWeight: '600',
    },
    department: {
      fontSize: 12,
    },
    contactButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 8,
      alignSelf: 'center',
      width: '60%',
    },
    actionIcon: {
      marginRight: 4,
    },
    actionText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '600',
    },
    emptyStateContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      marginTop: 24,
    },
    emptyStateTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginTop: 12,
      marginBottom: 4,
    },
    emptyStateText: {
      fontSize: 13,
      textAlign: 'center',
      lineHeight: 18,
    },
    emptyStateIconContainer: {
      padding: 14,
      borderRadius: 8,
      marginBottom: 10,
    },
  });
  
  // Fetch mentors and current student data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch mentors from Firestore
        const mentorsData = await getDocuments('mentors');
        console.log(`Fetched ${mentorsData.length} mentors from database`);
        setMentors(mentorsData);
        
        // Get current student from AuthContext or another source
        const studentsData = await getDocuments('students');
        if (studentsData.length > 0) {
          setCurrentStudent(studentsData[0]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter mentors based on search query
  const filteredMentors = mentors
    .filter(mentor => 
      searchQuery === '' || 
      (mentor.name && mentor.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (mentor.department && mentor.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (mentor.biography && mentor.biography.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      const nameA = (a.name || '').toLowerCase();
      const nameB = (b.name || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });
  
  // Check if current student is assigned to this mentor
  const isMyMentor = (mentorId) => {
    return currentStudent && currentStudent.mentorId === mentorId;
  };
  
  const handleContactMentor = (email) => {
    if (email) {
      Linking.openURL(`mailto:${email}`);
    }
  };
  
  const renderMentor = ({ item }) => {
    const isMine = isMyMentor(item.id);
    
    // Handle possible missing data
    const name = item.name || 'Unknown Mentor';
    const department = item.department || '';
    const email = item.email || '';
    
    return (
      <View style={[styles.mentorCard, { backgroundColor: theme.colors.card }]}>
        <View style={styles.mentorHeader}>
          {item.profileImageUrl ? (
            <Image source={{ uri: item.profileImageUrl }} style={styles.mentorImage} />
          ) : (
            <View style={[styles.initialsContainer, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.initials}>{getInitials(name)}</Text>
            </View>
          )}
          
          <View style={styles.mentorTitleContainer}>
            <Text style={[styles.mentorName, { color: theme.colors.text.primary }]}>{name}</Text>
            {department && (
              <Text style={[styles.department, { color: theme.colors.text.secondary }]}>
                {department}
              </Text>
            )}
          </View>
          
          {isMine && (
            <View style={[styles.myMentorBadge, { backgroundColor: theme.mode === 'dark' ? '#2A3A6A' : '#e8f4ff' }]}>
              <Text style={[styles.myMentorText, { color: theme.mode === 'dark' ? '#a4b7f0' : '#4e73df' }]}>My Mentor</Text>
            </View>
          )}
        </View>
        
        <TouchableOpacity 
          style={[styles.contactButton, { backgroundColor: theme.colors.primary }]} 
          onPress={() => handleContactMentor(email)}
          activeOpacity={0.8}
        >
          <Ionicons name="mail-outline" size={14} color="#fff" style={styles.actionIcon} />
          <Text style={styles.actionText}>Contact</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyStateContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} style={{marginBottom: 16}} />
          <Text style={[styles.emptyStateTitle, { color: theme.colors.text.primary }]}>
            Loading mentors
          </Text>
          <Text style={[styles.emptyStateText, { color: theme.colors.text.secondary }]}>
            Please wait while we fetch the mentors
          </Text>
        </View>
      );
    }
    
    return (
      <View style={styles.emptyStateContainer}>
        <View style={[styles.emptyStateIconContainer, { backgroundColor: theme.colors.background.tertiary }]}>
          <Ionicons name="people-outline" size={48} color={theme.colors.primary} />
        </View>
        <Text style={[styles.emptyStateTitle, { color: theme.colors.text.primary }]}>No mentors found</Text>
        <Text style={[styles.emptyStateText, { color: theme.colors.text.secondary }]}>
          Try adjusting your search criteria or check back later
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <View style={[styles.header, { 
        backgroundColor: theme.colors.background.secondary, 
        borderBottomColor: theme.colors.border,
        borderBottomWidth: 1
      }]}>
        <Text style={[styles.screenTitle, { color: theme.colors.text.primary }]}>Mentors</Text>
      </View>
      
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.background.tertiary }]}>
        <Ionicons name="search-outline" size={20} color={theme.colors.text.tertiary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text.primary }]}
          placeholder="Search mentors..."
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
        data={filteredMentors}
        renderItem={renderMentor}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.mentorsList}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default MentorsScreen;