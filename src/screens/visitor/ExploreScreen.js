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
  Alert,
  ActivityIndicator,
  Platform,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

// Import demo data and colors
import { LOCATIONS } from '../../utils/demoData';
import { IMAGES } from '../../assets';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH * 0.47;

// Corrected categories to match DePauw's categorization
const categories = [
  'All',
  'Learning Spaces',
  'Living Spaces',
  'Community Spaces',
  'Athletics & Wellness',
  'Arts, Performance & Production',
  'Surrounding Areas'
];

const ExploreScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredLocations, setFilteredLocations] = useState(LOCATIONS);
  const [imageLoading, setImageLoading] = useState({});
  
  // Filter locations when search query or category changes
  useEffect(() => {
    let filtered = LOCATIONS;
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(location => 
        location.name.toLowerCase().includes(query) || 
        location.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(location => 
        location.type === selectedCategory
      );
    }
    
    setFilteredLocations(filtered);
  }, [searchQuery, selectedCategory]);
  
  const handleViewLocation = (location) => {
    console.log('Opening location details:', location.id, location.name, {
      latitude: location.latitude,
      longitude: location.longitude
    });
    navigation.navigate('MapDirections', { locationId: location.id });
  };
  
  const openVirtualTour = (location) => {
    if (!location.virtualTourUrl) {
      Alert.alert(
        'Virtual Tour Unavailable',
        'This location does not have a virtual tour available at this time.'
      );
      return;
    }
    
    Linking.canOpenURL(location.virtualTourUrl)
      .then(supported => {
        if (supported) {
          return Linking.openURL(location.virtualTourUrl);
        } else {
          Alert.alert(
            'Virtual Tour Unavailable',
            'Cannot open the virtual tour at this time.'
          );
        }
      })
      .catch(err => {
        console.error('Error opening virtual tour:', err);
        Alert.alert('Error', 'Failed to open virtual tour');
      });
  };
  
  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryTab,
        selectedCategory === item && [
          styles.selectedCategoryTab,
          { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
        ],
        { backgroundColor: theme.colors.background.secondary, borderColor: theme.colors.border }
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item && [
            styles.selectedCategoryText,
            { color: '#000' }
          ],
          { color: theme.colors.text.secondary }
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );
  
  const renderLocation = ({ item }) => {
    const isLoading = imageLoading[item.id];

    return (
      <TouchableOpacity
        style={[styles.locationCard, { 
          backgroundColor: theme.colors.card, 
          shadowColor: theme.mode === 'dark' ? '#000' : '#888'
        }]}
        onPress={() => handleViewLocation(item)}
        activeOpacity={0.7}
      >
        <View style={styles.locationImageContainer}>
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
            </View>
          )}
          
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.locationImage}
            onLoadStart={() => setImageLoading(prev => ({ ...prev, [item.id]: true }))}
            onLoadEnd={() => setImageLoading(prev => ({ ...prev, [item.id]: false }))}
            resizeMode="cover"
          />
          
          <View style={[styles.locationTypeTag, { backgroundColor: 'rgba(0, 0, 0, 0.7)' }]}>
            <Text style={styles.locationTypeText}>{item.type}</Text>
          </View>
          
          <View style={[styles.locationInfoOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.7)' }]}>
            <Text style={styles.locationName} numberOfLines={2}>{item.name}</Text>
            
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.directionsButton, { backgroundColor: '#fff' }]}
                onPress={() => handleViewLocation(item)}
              >
                <Ionicons name="map" size={14} color="#000" style={{marginRight: 4}} />
                <Text style={styles.buttonText}>Directions</Text>
              </TouchableOpacity>

              {item.virtualTourUrl ? (
                <TouchableOpacity 
                  style={[styles.tourButton, { backgroundColor: theme.colors.primary }]}
                  onPress={() => openVirtualTour(item)}
                >
                  <Ionicons name="videocam" size={14} color="#000" style={{marginRight: 4}} />
                  <Text style={styles.buttonText}>Tour</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search" size={64} color={theme.colors.primary} />
      <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
        No locations found. Try a different search term or category.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} />
      
      <View style={[styles.header, { 
        backgroundColor: theme.colors.background.primary, 
        borderBottomColor: theme.colors.border 
      }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
              Explore Campus
            </Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.text.tertiary }]}>
              Find your way around DePauw
            </Text>
          </View>
          
          <Image
            source={IMAGES.depauw_logo}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
      </View>
      
      <View style={[styles.searchContainer, { 
        backgroundColor: theme.colors.background.secondary,
        borderColor: theme.colors.border
      }]}>
        <Ionicons name="search-outline" size={20} color={theme.colors.text.tertiary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text.primary }]}
          placeholder="Search locations..."
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
      
      <View style={styles.categoryContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />
      </View>
      
      <FlatList
        data={filteredLocations}
        renderItem={renderLocation}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.locationList}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={EmptyListComponent}
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
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 4,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  logoImage: {
    width: 40,
    height: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  categoryContainer: {
    marginVertical: 8,
  },
  categoryList: {
    paddingHorizontal: 16,
  },
  categoryTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  selectedCategoryTab: {
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedCategoryText: {
    fontWeight: '600',
  },
  locationList: {
    padding: 8,
    paddingBottom: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  locationCard: {
    width: CARD_WIDTH,
    height: 180,
    marginBottom: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  locationImageContainer: {
    position: 'relative',
    height: '100%',
    width: '100%',
  },
  locationImage: {
    width: '100%',
    height: '100%',
  },
  locationTypeTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  locationTypeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  locationInfoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  locationName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tourButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  directionsButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '500',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    zIndex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default ExploreScreen; 