import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import demo data
import { CLASSES, LOCATIONS } from '../../utils/demoData';
import { formatDate, formatTime } from '../../utils/helpers';
import { useTheme } from '../../context/ThemeContext';

const ClassDetailsScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  
  // Get class by ID from params, or use first class as default
  const classId = route.params?.classId?.replace('class-', '') || CLASSES[0].id;
  const classDetails = CLASSES.find(cls => cls.id === classId) || CLASSES[0];
  
  const handleNavigateToLocation = () => {
    // Map the classroom location name to an actual location ID
    // For example, "Julian Science Center 103" should match with "Julian Science and Mathematics Center"
    let locationId = null;
    
    // Extract the building name from the classroom location
    const classLocation = classDetails.location;
    
    // Find a matching location based on partial name matching
    const matchingLocation = LOCATIONS.find(location => {
      return classLocation.toLowerCase().includes(location.name.toLowerCase()) ||
             location.name.toLowerCase().includes(classLocation.split(' ')[0].toLowerCase());
    });
    
    if (matchingLocation) {
      locationId = matchingLocation.id;
    } else {
      // Default behavior: if no match, alert the user
      Alert.alert(
        'Location Not Found',
        'Could not find exact building location. Please use the Explore tab to find your destination.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    navigation.navigate('MapDirections', { locationId });
  };
  
  const handleContactInstructor = () => {
    // In a real app, this would open email or messaging
    console.log('Contact instructor:', classDetails.instructor);
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
      <View style={[styles.header, { 
        backgroundColor: theme.colors.background.primary,
        borderBottomColor: theme.colors.border
      }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>Class Details</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.classHeader, { 
          backgroundColor: theme.colors.background.primary,
          borderBottomColor: theme.colors.border
        }]}>
          <View style={[styles.classTypeIndicator, { backgroundColor: theme.colors.primary }]} />
          <View style={styles.classHeaderContent}>
            <Text style={[styles.className, { color: theme.colors.text.primary }]}>{classDetails.name}</Text>
            <View style={[styles.classBadge, { backgroundColor: theme.colors.primary + '20' }]}>
              <Text style={[styles.classBadgeText, { color: theme.colors.primary }]}>Class</Text>
            </View>
          </View>
        </View>
        
        <View style={[styles.detailsCard, { 
          backgroundColor: theme.colors.card,
          shadowColor: theme.mode === 'dark' ? '#000' : '#555'
        }]}>
          <View style={styles.detailRow}>
            <Ionicons name="person-outline" size={20} color={theme.colors.text.tertiary} style={styles.detailIcon} />
            <View>
              <Text style={[styles.detailLabel, { color: theme.colors.text.tertiary }]}>Instructor</Text>
              <Text style={[styles.detailValue, { color: theme.colors.text.primary }]}>{classDetails.instructor}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={20} color={theme.colors.text.tertiary} style={styles.detailIcon} />
            <View>
              <Text style={[styles.detailLabel, { color: theme.colors.text.tertiary }]}>Date</Text>
              <Text style={[styles.detailValue, { color: theme.colors.text.primary }]}>{formatDate(classDetails.schedule.date, 'full')}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={20} color={theme.colors.text.tertiary} style={styles.detailIcon} />
            <View>
              <Text style={[styles.detailLabel, { color: theme.colors.text.tertiary }]}>Time</Text>
              <Text style={[styles.detailValue, { color: theme.colors.text.primary }]}>{formatTime(classDetails.schedule.time)}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={20} color={theme.colors.text.tertiary} style={styles.detailIcon} />
            <View style={styles.locationDetail}>
              <View>
                <Text style={[styles.detailLabel, { color: theme.colors.text.tertiary }]}>Location</Text>
                <Text style={[styles.detailValue, { color: theme.colors.text.primary }]}>{classDetails.location}</Text>
              </View>
              <TouchableOpacity 
                style={[styles.directionsButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleNavigateToLocation}
              >
                <Ionicons name="navigate-outline" size={16} color="#fff" />
                <Text style={styles.directionsText}>Directions</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <View style={[styles.descriptionCard, { 
          backgroundColor: theme.colors.card,
          shadowColor: theme.mode === 'dark' ? '#000' : '#555'
        }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Description</Text>
          <Text style={[styles.descriptionText, { color: theme.colors.text.secondary }]}>{classDetails.description}</Text>
        </View>
        
        <View style={[styles.actionCard, { 
          backgroundColor: theme.colors.card,
          shadowColor: theme.mode === 'dark' ? '#000' : '#555'
        }]}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.colors.tertiary }]}
            onPress={handleContactInstructor}
          >
            <Ionicons name="mail-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Contact Instructor</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.secondary }]}>
            <Ionicons name="document-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>View Materials</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="calendar-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Add to Calendar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  classHeader: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
  },
  classTypeIndicator: {
    width: 6,
    borderRadius: 3,
    marginRight: 14,
  },
  classHeaderContent: {
    flex: 1,
  },
  className: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  classBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  classBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailsCard: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  detailIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
  },
  locationDetail: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  directionsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  descriptionCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  actionCard: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default ClassDetailsScreen; 