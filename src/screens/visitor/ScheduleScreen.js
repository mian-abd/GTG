import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

// Import Firebase functions
import { getDocuments, queryDocuments } from '../../utils/firebaseConfig';

// Import helper functions
import { formatDate, formatTime } from '../../utils/helpers';

const ScheduleScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { userData } = useAuth();
  
  // State for tabs and filtering
  const [activeTab, setActiveTab] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State for schedule items
  const [scheduleItems, setScheduleItems] = useState([]);
  const [filteredSchedule, setFilteredSchedule] = useState([]);
  
  // Fetch data when component mounts
  useEffect(() => {
    fetchScheduleData();
  }, []);
  
  const fetchScheduleData = async () => {
    setLoading(true);
    try {
      console.log('Fetching schedule data for student:', userData?.studentId || 'all');
      
      // Fetch events from the 'schedules' collection
      const fetchedSchedules = await getDocuments('schedules');
      
      console.log(`Fetched ${fetchedSchedules.length} schedule items`);
      
      if (fetchedSchedules && fetchedSchedules.length > 0) {
        setScheduleItems(fetchedSchedules);
      } else {
        // No data found
        console.log('No schedule items found in the database');
        setScheduleItems([]);
      }
    } catch (error) {
      console.error('Error fetching schedule data:', error);
      // Set empty array on error
      setScheduleItems([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Process schedule items for display
  const processScheduleItem = (item) => {
    // Determine the item type based on its properties or default to 'event'
    const type = item.type || (item.instructor ? 'class' : 'activity');
    
    return {
      id: item.id || `schedule-${Math.random().toString(36).substring(2, 9)}`,
      name: item.name || item.title || 'Untitled Event',
      type: type,
      time: item.time || item.schedule?.time || '09:00',
      date: item.date || item.schedule?.date || new Date().toISOString().split('T')[0],
      location: item.location || item.place || 'Unknown Location',
      instructor: item.instructor || null,
      description: item.description || item.details || '',
    };
  };
  
  // Function to filter schedule based on active tab and search query
  useEffect(() => {
    // Process all schedule items
    const processedItems = scheduleItems.map(processScheduleItem);
    
    // Filter based on search query
    let filtered = processedItems;
    if (searchQuery) {
      filtered = filtered.filter(item => 
        (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.instructor && item.instructor.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Filter based on selected tab
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    
    if (activeTab === 'today') {
      filtered = filtered.filter(item => item.date === today);
    } else if (activeTab === 'upcoming') {
      filtered = filtered.filter(item => item.date >= today);
    }
    
    // Sort by date and time
    filtered.sort((a, b) => {
      if (a.date === b.date) {
        return (a.time || '').localeCompare(b.time || '');
      }
      return (a.date || '').localeCompare(b.date || '');
    });
    
    setFilteredSchedule(filtered);
  }, [activeTab, searchQuery, scheduleItems]);
  
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
          console.log('View schedule details', item.id);
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
            
            {item.instructor && (
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

  // Render loading indicator
  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={[styles.loadingText, { color: theme.colors.text.primary }]}>Loading schedule...</Text>
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
        
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={fetchScheduleData}
        >
          <Ionicons name="refresh" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
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
      
      {loading ? (
        renderLoading()
      ) : (
        <FlatList
          data={filteredSchedule}
          renderItem={renderScheduleItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.scheduleList}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  refreshButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: 40,
  },
  clearButton: {
    padding: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  scheduleList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  scheduleItem: {
    flexDirection: 'row',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  itemTypeIndicator: {
    width: 6,
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
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  itemTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  itemTypeText: {
    fontSize: 12,
    fontWeight: '600',
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
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
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
    paddingHorizontal: 40,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  }
});

export default ScheduleScreen; 