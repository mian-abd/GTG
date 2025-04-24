import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, SafeAreaView, StatusBar, ActivityIndicator, RefreshControl, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

// Import schedule service
import { 
  getScheduleByDay, 
  initializeSchedule,
  formatScheduleTime
} from '../../utils/scheduleService';

const ScheduleScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const { userData } = useAuth();
  
  // State for tabs and filtering
  const [currentDay, setCurrentDay] = useState(1); // Default to Day 1
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // State for schedule items
  const [scheduleItems, setScheduleItems] = useState([]);
  
  // State for selected item and modal
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Initialize and fetch schedule data when component mounts or day changes
  useEffect(() => {
    initializeAndFetchData();
  }, []);

  // Fetch data whenever day changes
  useEffect(() => {
    fetchScheduleData();
  }, [currentDay]);
  
  const initializeAndFetchData = async () => {
    setLoading(true);
    try {
      // First ensure the schedule is initialized
      await initializeSchedule();
      
      // Then fetch data for current day
      await fetchScheduleData();
    } catch (error) {
      console.error('Error initializing and fetching schedule data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchScheduleData = async () => {
    try {
      setLoading(true);
      // Fetch schedule for current day
      const items = await getScheduleByDay(currentDay);
      
      console.log(`Fetched ${items.length} items for Day ${currentDay}`);
      
      // Sort by time
      items.sort((a, b) => {
        const timeA = timeToMinutes(a.startTime);
        const timeB = timeToMinutes(b.startTime);
        return timeA - timeB;
      });
      
      setScheduleItems(items);
    } catch (error) {
      console.error('Error fetching schedule data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchScheduleData();
    } catch (error) {
      console.error('Error refreshing schedule data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [currentDay]);
  
  // Convert time string to minutes for proper sorting
  const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    
    try {
      // First standardize the time format
      let hour = 0;
      let minute = 0;
      
      // Handle HH:MM format (24-hour)
      if (timeStr.includes(':') && !timeStr.toLowerCase().includes('am') && !timeStr.toLowerCase().includes('pm')) {
        const [hourStr, minuteStr] = timeStr.split(':');
        hour = parseInt(hourStr, 10);
        minute = parseInt(minuteStr, 10);
      }
      // Handle HH:MM AM/PM format
      else if (timeStr.includes(':')) {
        const isPM = timeStr.toLowerCase().includes('pm');
        const isAM = timeStr.toLowerCase().includes('am');
        
        // Strip out the AM/PM
        let timePart = timeStr.toLowerCase()
          .replace('am', '')
          .replace('pm', '')
          .replace('a.m.', '')
          .replace('p.m.', '')
          .replace(' ', '');
        
        const [hourStr, minuteStr] = timePart.split(':');
        hour = parseInt(hourStr, 10);
        minute = parseInt(minuteStr, 10);
        
        // Convert to 24-hour format
        if (isPM && hour < 12) {
          hour += 12;
        } else if (isAM && hour === 12) {
          hour = 0;
        }
      }
      
      return (hour * 60) + minute;
    } catch (error) {
      console.error('Error parsing time:', timeStr, error);
      return 0;
    }
  };
  
  // Filter items based on search query
  const getFilteredItems = () => {
    if (!searchQuery) return scheduleItems;
    
    return scheduleItems.filter(item => 
      (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.instructor && item.instructor.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };
  
  // Show item detail in modal
  const showItemDetail = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };
  
  // Render each schedule item
  const renderScheduleItem = ({ item }) => {
    // Determine item type and styling based on type
    const isClass = item.type === 'class' || item.type === 'session';
    const isMeal = item.type === 'meal';
    const isFree = item.type === 'free';
    
    // Determine color based on item type
    let itemColor = theme.colors.primary; // Default for activities
    if (isClass) itemColor = theme.colors.tertiary;
    if (isMeal) itemColor = theme.colors.success || '#4CAF50';
    if (isFree) itemColor = theme.colors.warning || '#FF9800';
    
    return (
      <TouchableOpacity 
        style={[styles.scheduleItem, { 
          backgroundColor: isDarkMode ? '#2A2A2A' : '#FFFFFF',
          borderColor: isDarkMode ? '#333333' : '#EEEEEE'
        }]}
        onPress={() => showItemDetail(item)}
      >
        <View style={[styles.itemTypeIndicator, { backgroundColor: itemColor }]} />
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Text style={[styles.itemName, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>
              {item.title || 'Untitled Event'}
            </Text>
            <View style={[styles.itemTypeBadge, { 
              backgroundColor: isDarkMode ? '#3A3A3A' : '#F5F5F5'
            }]}>
              <Text style={[styles.itemTypeText, { color: itemColor }]}>
                {isClass ? 'Session' : isMeal ? 'Meal' : isFree ? 'Free Time' : 'Activity'}
              </Text>
            </View>
          </View>
          
          <View style={styles.itemDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={16} color={isDarkMode ? '#CCCCCC' : '#666666'} style={styles.detailIcon} />
              <Text style={[styles.detailText, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
                {formatScheduleTime(item.startTime)} - {formatScheduleTime(item.endTime)}
              </Text>
            </View>
            
            {item.location && (
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={16} color={isDarkMode ? '#CCCCCC' : '#666666'} style={styles.detailIcon} />
                <Text style={[styles.detailText, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
                  {item.location}
                </Text>
              </View>
            )}
            
            {item.instructor && (
              <View style={styles.detailRow}>
                <Ionicons name="person-outline" size={16} color={isDarkMode ? '#CCCCCC' : '#666666'} style={styles.detailIcon} />
                <Text style={[styles.detailText, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
                  {item.instructor}
                </Text>
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
      <Ionicons name="calendar-outline" size={64} color={isDarkMode ? '#666666' : '#CCCCCC'} />
      <Text style={[styles.emptyStateTitle, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>
        No schedule items found
      </Text>
      <Text style={[styles.emptyStateText, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
        There are no events scheduled for Day {currentDay}.
      </Text>
    </View>
  );

  // Render loading indicator
  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#F9A826" />
      <Text style={[styles.loadingText, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>
        Loading schedule...
      </Text>
    </View>
  );

  // Render item detail modal
  const renderDetailModal = () => {
    if (!selectedItem) return null;
    
    const isClass = selectedItem.type === 'class' || selectedItem.type === 'session';
    const isMeal = selectedItem.type === 'meal';
    const isFree = selectedItem.type === 'free';
    
    // Determine color based on item type
    let itemColor = theme.colors.primary; // Default for activities
    if (isClass) itemColor = theme.colors.tertiary;
    if (isMeal) itemColor = theme.colors.success;
    if (isFree) itemColor = theme.colors.warning;
    
    return (
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { 
            backgroundColor: isDarkMode ? '#2A2A2A' : '#FFFFFF',
            borderColor: isDarkMode ? '#333333' : '#EEEEEE'
          }]}>
            <View style={styles.modalHeader}>
              <View style={[styles.itemTypeBadge, { 
                backgroundColor: isDarkMode ? '#3A3A3A' : '#F5F5F5'
              }]}>
                <Text style={[styles.itemTypeText, { color: itemColor }]}>
                  {isClass ? 'Session' : isMeal ? 'Meal' : isFree ? 'Free Time' : 'Activity'}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={isDarkMode ? '#FFFFFF' : '#333333'} />
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.modalTitle, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>
              {selectedItem.title || 'Untitled Event'}
            </Text>
            
            <View style={styles.itemDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={16} color={isDarkMode ? '#CCCCCC' : '#666666'} style={styles.detailIcon} />
                <Text style={[styles.detailText, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
                  {formatScheduleTime(selectedItem.startTime)} - {formatScheduleTime(selectedItem.endTime)}
                </Text>
              </View>
              
              {selectedItem.location && (
                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={16} color={isDarkMode ? '#CCCCCC' : '#666666'} style={styles.detailIcon} />
                  <Text style={[styles.detailText, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
                    {selectedItem.location}
                  </Text>
                </View>
              )}
              
              {selectedItem.instructor && (
                <View style={styles.detailRow}>
                  <Ionicons name="person-outline" size={16} color={isDarkMode ? '#CCCCCC' : '#666666'} style={styles.detailIcon} />
                  <Text style={[styles.detailText, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
                    {selectedItem.instructor}
                  </Text>
                </View>
              )}
            </View>
            
            {selectedItem.description && (
              <View style={styles.descriptionContainer}>
                <Text style={[styles.descriptionLabel, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>
                  Description
                </Text>
                <Text style={[styles.descriptionText, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
                  {selectedItem.description}
                </Text>
              </View>
            )}
            
            {isClass && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: itemColor }]}
                onPress={() => {
                  setModalVisible(false);
                  // Navigate to detailed class view if applicable
                  if (selectedItem.classId) {
                    navigation.navigate('ClassDetails', { id: selectedItem.classId });
                  }
                }}
              >
                <Text style={styles.actionButtonText}>View Session Details</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { 
      backgroundColor: isDarkMode ? theme.colors.background.primary : '#FFFFFF' 
    }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      <View style={styles.container}>
        {/* Header and Search */}
        <View style={[styles.header, { 
          backgroundColor: isDarkMode ? theme.colors.background.primary : '#FFFFFF',
          borderBottomColor: isDarkMode ? '#333333' : '#EEEEEE' 
        }]}>
          {/* Search Row */}
          <View style={styles.searchRow}>
            <View style={[styles.searchBar, { 
              backgroundColor: isDarkMode ? '#333333' : '#F5F5F5',
              borderColor: isDarkMode ? '#444444' : '#E0E0E0',
              flex: 1
            }]}>
              <Ionicons name="search" size={20} color={isDarkMode ? '#CCCCCC' : '#666666'} />
              <TextInput
                placeholder="Search schedule..."
                placeholderTextColor={isDarkMode ? '#999999' : '#999999'}
                style={[styles.searchInput, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color={isDarkMode ? '#CCCCCC' : '#666666'} />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
          
          {/* Day Tabs Row */}
          <View style={styles.tabs}>
            <TouchableOpacity 
              style={[
                styles.tab, 
                currentDay === 1 && [styles.activeTab, { 
                  backgroundColor: isDarkMode ? theme.colors.primary : theme.colors.primary,
                }]
              ]}
              onPress={() => setCurrentDay(1)}
            >
              <Text style={[
                styles.tabText, 
                currentDay === 1 ? { color: '#FFFFFF', fontWeight: 'bold' } : { 
                  color: isDarkMode ? '#CCCCCC' : '#666666' 
                }
              ]}>
                Day 1
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.tab, 
                currentDay === 2 && [styles.activeTab, { 
                  backgroundColor: isDarkMode ? theme.colors.primary : theme.colors.primary,
                }]
              ]}
              onPress={() => setCurrentDay(2)}
            >
              <Text style={[
                styles.tabText, 
                currentDay === 2 ? { color: '#FFFFFF', fontWeight: 'bold' } : { 
                  color: isDarkMode ? '#CCCCCC' : '#666666' 
                }
              ]}>
                Day 2
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Schedule List */}
        {loading ? (
          renderLoading()
        ) : (
          <FlatList
            data={getFilteredItems()}
            keyExtractor={(item) => item.id || `${item.title}-${item.startTime}`}
            renderItem={renderScheduleItem}
            ListEmptyComponent={renderEmptyState()}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.primary]}
                tintColor={isDarkMode ? '#FFFFFF' : theme.colors.primary}
              />
            }
          />
        )}
      </View>
      
      {/* Modal for item details */}
      {renderDetailModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: 40,
  },
  tabs: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#2A2A2A',
  },
  activeTab: {
    backgroundColor: '#F9A826',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 80,
  },
  scheduleItem: {
    flexDirection: 'row',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemTypeIndicator: {
    width: 6,
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
    marginRight: 8,
  },
  itemTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
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
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  closeButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  descriptionContainer: {
    marginTop: 16,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionButton: {
    marginTop: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  }
});

export default ScheduleScreen; 