import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import demo data
import { CLASSES } from '../../utils/demoData';
import { formatDate, formatTime } from '../../utils/helpers';

const ClassDetailsScreen = ({ navigation, route }) => {
  // Get class by ID from params, or use first class as default
  const classId = route.params?.classId?.replace('class-', '') || CLASSES[0].id;
  const classDetails = CLASSES.find(cls => cls.id === classId) || CLASSES[0];
  
  const handleNavigateToLocation = () => {
    navigation.navigate('MapDirections', { locationId: classDetails.location });
  };
  
  const handleContactInstructor = () => {
    // In a real app, this would open email or messaging
    console.log('Contact instructor:', classDetails.instructor);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Class Details</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.classHeader}>
          <View style={styles.classTypeIndicator} />
          <View style={styles.classHeaderContent}>
            <Text style={styles.className}>{classDetails.name}</Text>
            <View style={styles.classBadge}>
              <Text style={styles.classBadgeText}>Class</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Ionicons name="person-outline" size={20} color="#666" style={styles.detailIcon} />
            <View>
              <Text style={styles.detailLabel}>Instructor</Text>
              <Text style={styles.detailValue}>{classDetails.instructor}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={20} color="#666" style={styles.detailIcon} />
            <View>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{formatDate(classDetails.schedule.date, 'full')}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={20} color="#666" style={styles.detailIcon} />
            <View>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>{formatTime(classDetails.schedule.time)}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={20} color="#666" style={styles.detailIcon} />
            <View style={styles.locationDetail}>
              <View>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>{classDetails.location}</Text>
              </View>
              <TouchableOpacity 
                style={styles.directionsButton} 
                onPress={handleNavigateToLocation}
              >
                <Ionicons name="navigate-outline" size={16} color="#fff" />
                <Text style={styles.directionsText}>Directions</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <View style={styles.descriptionCard}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{classDetails.description}</Text>
        </View>
        
        <View style={styles.actionCard}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleContactInstructor}
          >
            <Ionicons name="mail-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Contact Instructor</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="document-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>View Materials</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
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
  classHeader: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  classTypeIndicator: {
    width: 6,
    backgroundColor: '#4e73df',
    borderRadius: 3,
    marginRight: 14,
  },
  classHeaderContent: {
    flex: 1,
  },
  className: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  classBadge: {
    backgroundColor: '#e8eeff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  classBadgeText: {
    color: '#4e73df',
    fontSize: 12,
    fontWeight: '600',
  },
  detailsCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
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
    color: '#999',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
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
    backgroundColor: '#f9a826',
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
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
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
  descriptionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  actionCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4e73df',
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