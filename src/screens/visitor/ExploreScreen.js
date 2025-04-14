import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import demo data and helpers
import { LOCATIONS } from '../../utils/demoData';
import { truncateText } from '../../utils/helpers';

const ExploreScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Get unique location types for category filtering
  const locationTypes = ['all', ...Array.from(new Set(LOCATIONS.map(loc => loc.type)))];
  
  // Filter locations based on search query and active category
  const filteredLocations = LOCATIONS.filter(location => {
    const matchesSearch = searchQuery === '' || 
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = activeCategory === 'all' || location.type === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const handleViewLocation = (location) => {
    // Will navigate to location details screen in future
    console.log('View location details:', location.id);
  };
  
  const renderLocation = ({ item }) => (
    <TouchableOpacity 
      style={styles.locationCard}
      onPress={() => handleViewLocation(item)}
    >
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.locationImage} />
      ) : (
        <View style={styles.placeholderImage}>
          <Ionicons name="location-outline" size={40} color="#fff" />
        </View>
      )}
      
      <View style={styles.locationMeta}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.type}</Text>
        </View>
      </View>
      
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{item.name}</Text>
        <Text style={styles.locationDescription}>
          {truncateText(item.description, 120)}
        </Text>
        
        {item.coordinates && (
          <View style={styles.locationCoordinates}>
            <Ionicons name="navigate-outline" size={16} color="#666" />
            <Text style={styles.coordinatesText}>
              {item.coordinates.latitude.toFixed(6)}, {item.coordinates.longitude.toFixed(6)}
            </Text>
          </View>
        )}
      </View>
      
      <TouchableOpacity style={styles.directionsButton}>
        <Ionicons name="map-outline" size={18} color="#fff" />
        <Text style={styles.directionsText}>Directions</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
  
  const renderCategoryTab = (category) => {
    const isActive = category === activeCategory;
    return (
      <TouchableOpacity
        key={category}
        style={[styles.categoryTab, isActive && styles.activeCategoryTab]}
        onPress={() => setActiveCategory(category)}
      >
        <Text style={[styles.categoryTabText, isActive && styles.activeCategoryTabText]}>
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Text>
      </TouchableOpacity>
    );
  };
  
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="location-outline" size={64} color="#ccc" />
      <Text style={styles.emptyStateTitle}>No locations found</Text>
      <Text style={styles.emptyStateText}>
        Try adjusting your search criteria
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Explore Campus</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search locations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.categoriesContainer}>
        <FlatList
          data={locationTypes}
          renderItem={({ item }) => renderCategoryTab(item)}
          keyExtractor={item => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      
      <FlatList
        data={filteredLocations}
        renderItem={renderLocation}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.locationsList}
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
  categoriesContainer: {
    marginBottom: 8,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeCategoryTab: {
    backgroundColor: '#4e73df',
  },
  categoryTabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeCategoryTabText: {
    color: '#fff',
  },
  locationsList: {
    padding: 16,
    paddingBottom: 80,
  },
  locationCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  locationImage: {
    width: '100%',
    height: 160,
  },
  placeholderImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#c2c9d6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationMeta: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  categoryBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  locationInfo: {
    padding: 16,
  },
  locationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  locationDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  locationCoordinates: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  coordinatesText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9a826',
    padding: 12,
  },
  directionsText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
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

export default ExploreScreen; 