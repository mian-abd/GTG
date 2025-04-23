import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  SafeAreaView,
  StatusBar,
  ActivityIndicator
} from 'react-native';
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
  
  // Use mentor data from auth
  const currentMentor = userData ? { 
    id: userData.uid || userData.mentorId, 
    name: userData.displayName || userData.email 
  } : { id: null, name: null };
  
  // Fetch data when component mounts or mentor changes
  useEffect(() => {
    fetchScheduleData();
  }, [currentMentor.id]);
  
  const fetchScheduleData = async () => {
    setLoading(true);
    try {
      console.log('Fetching schedule data for mentor:', currentMentor.id || 'all');
      
      let fetchedSchedules = [];
      
      if (currentMentor.id) {
        // Query schedules related to this mentor
        fetchedSchedules = await queryDocuments('schedules', [
          ['mentorId', '==', currentMentor.id],
        ]);
        
        // Also get other events where instructor or participants include this mentor
        const instructorEvents = await queryDocuments('schedules', [
          ['instructor', '==', currentMentor.name],
        ]);
        
        // Add any events not already included
        instructorEvents.forEach(event => {
          if (!fetchedSchedules.some(e => e.id === event.id)) {
            fetchedSchedules.push(event);
          }
        });
      } else {
        // Fallback to get all schedules if no mentor ID
        fetchedSchedules = await getDocuments('schedules');
      }
      
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
    // Determine the item type based on its properties
    let type = item.type || 'event';
    if (!type) {
      if (item.instructor === currentMentor.name) type = 'class';
      else if (item.student) type = 'meeting';
      else type = 'activity';
    }
    
    return {
      id: item.id || `schedule-${Math.random().toString(36).substring(2, 9)}`,
      name: item.name || item.title || 'Untitled Event',
      type: type,
      time: item.time || item.schedule?.time || '09:00',
      date: item.date || item.schedule?.date || new Date().toISOString().split('T')[0],
      location: item.location || item.place || 'Unknown Location',
      student: item.student || null,
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
        (item.student && item.student.toLowerCase().includes(searchQuery.toLowerCase())) ||
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
    // Determine the type-specific properties
    let typeColor, typeBadgeColor, typeTextColor;
    
    switch (item.type) {
      case 'class':
        typeColor = theme.colors.tertiary;
        typeBadgeColor = theme.mode === 'dark' ? 'rgba(93, 95, 239, 0.2)' : '#e8eeff';
        typeTextColor = theme.colors.tertiary;
        break;
      case 'activity':
        typeColor = theme.colors.primary;
        typeBadgeColor = theme.mode === 'dark' ? 'rgba(249, 168, 38, 0.2)' : '#fff8e8';
        typeTextColor = theme.colors.primary;
        break;
      case 'meeting':
        typeColor = theme.colors.success;
        typeBadgeColor = theme.mode === 'dark' ? 'rgba(46, 204, 113, 0.2)' : '#e8fff0';
        typeTextColor = theme.colors.success;
        break;
      default:
        typeColor = theme.colors.text.tertiary;
        typeBadgeColor = theme.mode === 'dark' ? 'rgba(153, 153, 153, 0.2)' : '#f0f0f0';
        typeTextColor = theme.colors.text.tertiary;
    }
    
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
        <View style={[styles.itemTypeIndicator, { backgroundColor: typeColor }]} />
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Text style={[styles.itemName, { color: theme.colors.text.primary }]}>{item.name}</Text>
            <View style={[styles.itemTypeBadge, { backgroundColor: typeBadgeColor }]}>
              <Text style={[styles.itemTypeText, { color: typeTextColor }]}>
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
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
            
            {item.student && (
              <View style={styles.detailRow}>
                <Ionicons name="person-outline" size={16} color={theme.colors.text.secondary} style={styles.detailIcon} />
                <Text style={[styles.detailText, { color: theme.colors.text.secondary }]}>{item.student}</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  screenTitle: {
    fontSize: 24,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ScheduleScreen; 