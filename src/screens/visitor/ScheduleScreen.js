import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import demo data and helper functions
import { ACTIVITIES, CLASSES, STUDENTS } from '../../utils/demoData';
import { formatDate, formatTime } from '../../utils/helpers';

// Using first student as the current visitor
const currentStudent = STUDENTS[0];

const ScheduleScreen = ({ navigation }) => {
  // State for tabs and filtering
  const [activeTab, setActiveTab] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get classes for the current student
  const studentClasses = CLASSES.filter(cls => 
    currentStudent.classSchedule.includes(cls.id)
  );
  
  // Get activities the student is participating in
  const studentActivities = ACTIVITIES.filter(activity => 
    activity.participants.includes(currentStudent.id)
  );
  
  // Combined schedule items (classes and activities)
  const [filteredSchedule, setFilteredSchedule] = useState([]);
  
  // Function to filter schedule based on active tab and search query
  useEffect(() => {
    // Convert classes and activities to a common schedule item format
    const classItems = studentClasses.map(cls => ({
      id: `class-${cls.id}`,
      name: cls.name,
      type: 'class',
      time: cls.schedule.time,
      date: cls.schedule.date,
      location: cls.location,
      instructor: cls.instructor,
      description: cls.description,
    }));
    
    const activityItems = studentActivities.map(activity => ({
      id: `activity-${activity.id}`,
      name: activity.name,
      type: 'activity',
      time: activity.time,
      date: activity.date,
      location: activity.location,
      description: activity.description,
    }));
    
    // Combine both types of items
    let combinedSchedule = [...classItems, ...activityItems];
    
    // Filter based on search query
    if (searchQuery) {
      combinedSchedule = combinedSchedule.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.instructor && item.instructor.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Filter based on selected tab
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    
    if (activeTab === 'today') {
      combinedSchedule = combinedSchedule.filter(item => item.date === today);
    } else if (activeTab === 'upcoming') {
      combinedSchedule = combinedSchedule.filter(item => item.date >= today);
    }
    
    // Sort by date and time
    combinedSchedule.sort((a, b) => {
      if (a.date === b.date) {
        return a.time.localeCompare(b.time);
      }
      return a.date.localeCompare(b.date);
    });
    
    setFilteredSchedule(combinedSchedule);
  }, [activeTab, searchQuery]);
  
  // Render each schedule item
  const renderScheduleItem = ({ item }) => {
    const isClass = item.type === 'class';
    
    return (
      <TouchableOpacity 
        style={styles.scheduleItem}
        onPress={() => {
          // Navigate to details screen based on type
          if (isClass) {
            // Navigate to class details
            console.log('Navigate to class details', item.id);
          } else {
            // Navigate to activity details
            console.log('Navigate to activity details', item.id);
          }
        }}
      >
        <View style={[styles.itemTypeIndicator, { backgroundColor: isClass ? '#4e73df' : '#f9a826' }]} />
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemName}>{item.name}</Text>
            <View style={[styles.itemTypeBadge, { backgroundColor: isClass ? '#e8eeff' : '#fff8e8' }]}>
              <Text style={[styles.itemTypeText, { color: isClass ? '#4e73df' : '#f9a826' }]}>
                {isClass ? 'Class' : 'Activity'}
              </Text>
            </View>
          </View>
          
          <View style={styles.itemDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={16} color="#666" style={styles.detailIcon} />
              <Text style={styles.detailText}>{formatDate(item.date, 'medium')}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={16} color="#666" style={styles.detailIcon} />
              <Text style={styles.detailText}>{formatTime(item.time)}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={16} color="#666" style={styles.detailIcon} />
              <Text style={styles.detailText}>{item.location}</Text>
            </View>
            
            {isClass && (
              <View style={styles.detailRow}>
                <Ionicons name="person-outline" size={16} color="#666" style={styles.detailIcon} />
                <Text style={styles.detailText}>{item.instructor}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  // Return empty state component when no schedule items are found
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="calendar-outline" size={64} color="#ccc" />
      <Text style={styles.emptyStateTitle}>No events found</Text>
      <Text style={styles.emptyStateText}>
        {activeTab === 'today' 
          ? "You don't have any events scheduled for today." 
          : activeTab === 'upcoming' 
            ? "You don't have any upcoming events." 
            : "No events match your search criteria."}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>My Schedule</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search events..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'today' && styles.activeTab]}
          onPress={() => setActiveTab('today')}
        >
          <Text style={[styles.tabText, activeTab === 'today' && styles.activeTabText]}>Today</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>Upcoming</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All Events</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredSchedule}
        renderItem={renderScheduleItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.scheduleList}
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
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#f9a826',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#888',
  },
  activeTabText: {
    color: '#f9a826',
    fontWeight: '600',
  },
  scheduleList: {
    padding: 16,
    paddingTop: 8,
  },
  scheduleItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  itemTypeIndicator: {
    width: 6,
    backgroundColor: '#4e73df',
  },
  itemContent: {
    flex: 1,
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  itemTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  itemTypeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  itemDetails: {
    marginTop: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailIcon: {
    marginRight: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
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

export default ScheduleScreen; 