import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

// Import demo data and helper functions
import { ACTIVITIES, CLASSES, STUDENTS } from '../../utils/demoData';
import { formatDate, formatTime } from '../../utils/helpers';

// Using first student as the current visitor
const currentStudent = STUDENTS[0];

const ScheduleScreen = ({ navigation }) => {
  const { theme } = useTheme();
  
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
        style={[styles.scheduleItem, { 
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border
        }]}
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
        <View style={[styles.itemTypeIndicator, { backgroundColor: isClass ? theme.colors.tertiary : theme.colors.primary }]} />
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Text style={[styles.itemName, { color: theme.colors.text.primary }]}>{item.name}</Text>
            <View style={[styles.itemTypeBadge, { 
              backgroundColor: isClass 
                ? theme.mode === 'dark' ? 'rgba(93, 95, 239, 0.2)' : '#e8eeff' 
                : theme.mode === 'dark' ? 'rgba(249, 168, 38, 0.2)' : '#fff8e8' 
            }]}>
              <Text style={[styles.itemTypeText, { color: isClass ? theme.colors.tertiary : theme.colors.primary }]}>
                {isClass ? 'Class' : 'Activity'}
              </Text>
            </View>
          </View>
          
          <View style={styles.itemDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={16} color={theme.colors.text.secondary} style={styles.detailIcon} />
              <Text style={[styles.detailText, { color: theme.colors.text.secondary }]}>{formatDate(item.date, 'medium')}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={16} color={theme.colors.text.secondary} style={styles.detailIcon} />
              <Text style={[styles.detailText, { color: theme.colors.text.secondary }]}>{formatTime(item.time)}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={16} color={theme.colors.text.secondary} style={styles.detailIcon} />
              <Text style={[styles.detailText, { color: theme.colors.text.secondary }]}>{item.location}</Text>
            </View>
            
            {isClass && (
              <View style={styles.detailRow}>
                <Ionicons name="person-outline" size={16} color={theme.colors.text.secondary} style={styles.detailIcon} />
                <Text style={[styles.detailText, { color: theme.colors.text.secondary }]}>{item.instructor}</Text>
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
      <Ionicons name="calendar-outline" size={64} color={theme.colors.text.tertiary} />
      <Text style={[styles.emptyStateTitle, { color: theme.colors.text.primary }]}>No events found</Text>
      <Text style={[styles.emptyStateText, { color: theme.colors.text.secondary }]}>
        {activeTab === 'today' 
          ? "You don't have any events scheduled for today." 
          : activeTab === 'upcoming' 
            ? "You don't have any upcoming events." 
            : "No events match your search criteria."}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <StatusBar barStyle={theme.colors.statusBar} backgroundColor={theme.colors.background.primary} />
      <View style={[styles.header, { 
        backgroundColor: theme.colors.background.secondary,
        borderBottomColor: theme.colors.border 
      }]}>
        <Text style={[styles.screenTitle, { color: theme.colors.text.primary }]}>My Schedule</Text>
      </View>
      
      <View style={[styles.searchContainer, { 
        backgroundColor: theme.colors.card,
        borderColor: theme.colors.border 
      }]}>
        <Ionicons name="search-outline" size={20} color={theme.colors.text.tertiary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text.primary }]}
          placeholder="Search events..."
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
      
      <View style={[styles.tabContainer, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity
          style={[
            styles.tab, 
            activeTab === 'today' && [styles.activeTab, { borderBottomColor: theme.colors.primary }]
          ]}
          onPress={() => setActiveTab('today')}
        >
          <Text style={[
            styles.tabText, 
            { color: theme.colors.text.secondary },
            activeTab === 'today' && { color: theme.colors.primary }
          ]}>Today</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab, 
            activeTab === 'upcoming' && [styles.activeTab, { borderBottomColor: theme.colors.primary }]
          ]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[
            styles.tabText, 
            { color: theme.colors.text.secondary },
            activeTab === 'upcoming' && { color: theme.colors.primary }
          ]}>Upcoming</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab, 
            activeTab === 'all' && [styles.activeTab, { borderBottomColor: theme.colors.primary }]
          ]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[
            styles.tabText, 
            { color: theme.colors.text.secondary },
            activeTab === 'all' && { color: theme.colors.primary }
          ]}>All Events</Text>
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
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontWeight: '500',
  },
  scheduleList: {
    padding: 16,
    paddingBottom: 24,
  },
  scheduleItem: {
    flexDirection: 'row',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },
  itemTypeIndicator: {
    width: 4,
  },
  itemContent: {
    flex: 1,
    padding: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  itemTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  itemTypeText: {
    fontSize: 12,
    fontWeight: 'bold',
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
    width: 16,
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 40,
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
  },
});

export default ScheduleScreen; 