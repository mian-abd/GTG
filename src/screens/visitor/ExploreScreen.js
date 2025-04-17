import React, { useState, useEffect, useCallback } from 'react';
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
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

// Import demo data
import { LOCATIONS } from '../../utils/demoData';

// Map location names to local asset filenames
const locationImages = {
  'Julian Science and Mathematics Center': require('../../../assets/The Percy L. Julian Science and Mathematics Center.jpg'),
  'Hoover Hall': require('../../../assets/Hoover Hall.jpg'),
  'Roy O. West Library': require('../../../assets/Roy O. West Library.jpg'),
  'Green Center for the Performing Arts': require('../../../assets/The Judson and Joyce Green Center for the Performing Arts.jpg'),
  'Lilly Center': require('../../../assets/The Lilly Center.jpg'),
  'Peeler Art Center': require('../../../assets/The Richard E. Peeler Art Center.jpg'),
  'East College': require('../../../assets/East college.jpg'),
  'Asbury Hall': require('../../../assets/Asbury Hall.jpg'),
  'Harrison Hall': require('../../../assets/Harrison Hall.jpg'),
  'Bowman Park': require('../../../assets/Bowman Park.jpg'),
  'Memorial Student Union': require('../../../assets/The Memorial Student Union Building.jpg'),
  'Rector Village': require('../../../assets/Hoover Hall.jpg'), // No specific image available
  'Humbert Hall': require('../../../assets/Humbert Hall.jpeg'),
  'Ubben Quadrangle': require('../../../assets/ubben quadrangle.jpg'),
  'Reavis Stadium': require('../../../assets/DePauw Athletics Facilities.jpg'),
  'Prindle Institute for Ethics': require('../../../assets/Prindle Institute for Ethics.jpeg'),
  'DePauw Nature Park': require('../../../assets/DePauw Nature Park.jpg'),
  'Greencastle Square': require('../../../assets/Eli\'s Books.jpg'),
  'Center for Diversity and Inclusion': require('../../../assets/The Justin and Darrianne Christian Center for Diversity and Inclusion.jpg'),
};

// Simplified categories matching the UI in the image
const categories = [
  'All',
  'Academic',
  'Residential',
  'Dining'
];

// Map from our location types to simplified categories
const categoryMapping = {
  'Learning Spaces': 'Academic',
  'Living Spaces': 'Residential',
  'Community Spaces': 'Dining', // Assuming community spaces includes dining
  'Athletics & Wellness': 'Academic',
  'Arts, Performance & Production': 'Academic',
  'Surrounding Areas': 'Academic'
};

const { width } = Dimensions.get('window');
const cardWidth = width - 32; // Full width minus padding

// Function to check if virtual tour is available
const hasVirtualTour = (location) => {
  if (!location) return false;
  
  // Exclude tours for these locations
  const noTourLocations = [
    'East College',
    'Asbury Hall',
    'Harrison Hall',
    'Memorial Student Union',
    'Rector Village'
  ];
  
  if (noTourLocations.includes(location.name)) {
    return false;
  }
  
  // Check if virtualTourUrl exists and is not empty
  return Boolean(location.virtualTourUrl);
};

const ExploreScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredLocations, setFilteredLocations] = useState(LOCATIONS.filter(loc => loc.name !== 'Bloomington Street Greenway'));
  const [imageLoading, setImageLoading] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  
  // Filter locations when search query or category changes
  useEffect(() => {
    let filtered = LOCATIONS.filter(loc => loc.name !== 'Bloomington Street Greenway');
    
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
        categoryMapping[location.type] === selectedCategory
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate a refresh operation
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  
  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryTab,
        selectedCategory === item && [
          styles.selectedCategoryTab,
          { backgroundColor: theme.colors.primary }
        ],
        { backgroundColor: theme.mode === 'dark' ? '#333' : '#f0f0f0' }
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item && styles.selectedCategoryText,
          { color: selectedCategory === item ? '#fff' : theme.colors.text.primary }
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );
  
  const renderLocation = ({ item }) => {
    const isLoading = imageLoading[item.id];
    const simplifiedType = categoryMapping[item.type] || item.type;
    
    // Use local image if available, otherwise fall back to URL
    const imageSource = locationImages[item.name] || { uri: item.imageUrl };
    
    // Check if virtual tour is available
    const hasTour = hasVirtualTour(item);

    return (
      <TouchableOpacity 
        style={[styles.locationCard, { 
          backgroundColor: theme.colors.card,
          shadowColor: theme.mode === 'dark' ? '#000' : '#888',
        }]}
        onPress={() => handleViewLocation(item)}
        activeOpacity={0.8}
      >
        <View style={styles.locationImageContainer}>
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
            </View>
          )}
          
          <Image
            source={imageSource}
            style={styles.locationImage}
            onLoadStart={() => setImageLoading(prev => ({ ...prev, [item.id]: true }))}
            onLoadEnd={() => setImageLoading(prev => ({ ...prev, [item.id]: false }))}
            resizeMode="cover"
          />
          
          <View style={[styles.locationTypeTag, { backgroundColor: theme.colors.tertiary }]}>
            <Text style={styles.locationTypeText}>{simplifiedType.toUpperCase()}</Text>
          </View>
          
          {hasTour && (
            <View style={[styles.tourTag, { backgroundColor: theme.colors.secondary }]}>
              <Ionicons name="cube" size={12} color="#fff" style={{ marginRight: 4 }} />
              <Text style={styles.tourTagText}>TOUR</Text>
            </View>
          )}
        </View>
        
        <View style={styles.locationInfo}>
          <Text style={[styles.locationName, { color: theme.colors.text.primary }]}>{item.name}</Text>
          <Text style={[styles.locationDescription, { color: theme.colors.text.secondary }]} numberOfLines={2}>
            {item.description}
          </Text>
          
          {item.latitude && item.longitude && (
            <Text style={[styles.locationCoordinates, { color: theme.colors.text.tertiary }]}>
              <Ionicons name="navigate-outline" size={12} /> {item.latitude.toFixed(6)}, {item.longitude.toFixed(6)}
            </Text>
          )}
          
          <TouchableOpacity 
            style={[styles.directionsButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => handleViewLocation(item)}
          >
            <Ionicons name="map-outline" size={16} color="#fff" style={{ marginRight: 4 }} />
            <Text style={styles.directionsButtonText}>View Directions</Text>
          </TouchableOpacity>
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
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
          Explore Campus
        </Text>
      </View>
      
      <View style={[styles.searchContainer, { 
        backgroundColor: theme.mode === 'dark' ? '#333' : '#f5f5f5',
        borderColor: theme.colors.border,
        shadowColor: theme.mode === 'dark' ? '#000' : '#888',
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
        contentContainerStyle={styles.locationList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={EmptyListComponent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
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
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    height: 46,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 46,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryList: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  categoryTab: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginRight: 12,
    borderRadius: 24,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  selectedCategoryTab: {
    borderWidth: 0,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  selectedCategoryText: {
    fontWeight: '700',
  },
  locationList: {
    padding: 16,
    paddingTop: 0,
  },
  locationCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  locationImageContainer: {
    height: 200,
    width: '100%',
    position: 'relative',
  },
  locationImage: {
    width: '100%',
    height: '100%',
  },
  locationTypeTag: {
    position: 'absolute',
    top: 16,
    left: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  locationTypeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  tourTag: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tourTagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  locationInfo: {
    padding: 16,
  },
  locationName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  locationDescription: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  locationCoordinates: {
    fontSize: 12,
    marginBottom: 16,
  },
  directionsButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  directionsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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