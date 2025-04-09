import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  Dimensions,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import demo data
import { LOCATIONS } from '../../utils/demoData';

// Mock map image (in a real app, you would use a mapping library like react-native-maps)
const mapPlaceholder = 'https://i.imgur.com/WmQdC5q.png';

const MapDirectionsScreen = ({ navigation, route }) => {
  // Default to first location if none specified
  const [selectedLocation, setSelectedLocation] = useState(
    route.params?.locationId 
      ? LOCATIONS.find(loc => loc.id === route.params.locationId) 
      : LOCATIONS[0]
  );
  
  const [showDirections, setShowDirections] = useState(false);
  
  // Steps for directions (mock data - in a real app, this would come from a routing API)
  const directionSteps = [
    { 
      id: '1', 
      instruction: 'Exit the student center and head east', 
      distance: '150m',
      time: '2 min'
    },
    { 
      id: '2', 
      instruction: 'Turn right at the library', 
      distance: '200m',
      time: '3 min'
    },
    { 
      id: '3', 
      instruction: 'Continue straight past the science building', 
      distance: '100m',
      time: '1 min'
    },
    { 
      id: '4', 
      instruction: `Arrive at ${selectedLocation?.name}`, 
      distance: '0m',
      time: '0 min'
    },
  ];
  
  const openInMaps = () => {
    // In a real app, this would open the device's maps app with the coordinates
    if (selectedLocation?.coordinates) {
      const { latitude, longitude } = selectedLocation.coordinates;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      Linking.openURL(url);
    }
  };
  
  const renderLocationDetails = () => (
    <View style={styles.detailsContainer}>
      <Text style={styles.locationName}>{selectedLocation?.name}</Text>
      <Text style={styles.locationType}>{selectedLocation?.type}</Text>
      <Text style={styles.locationDescription}>{selectedLocation?.description}</Text>
      
      {selectedLocation?.coordinates && (
        <View style={styles.coordinatesContainer}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.coordinatesText}>
            {selectedLocation.coordinates.latitude.toFixed(6)}, {selectedLocation.coordinates.longitude.toFixed(6)}
          </Text>
        </View>
      )}
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.directionsButton]} 
          onPress={() => setShowDirections(!showDirections)}
        >
          <Ionicons name="map-outline" size={18} color="#fff" />
          <Text style={styles.buttonText}>
            {showDirections ? 'Hide Directions' : 'Show Directions'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.openMapsButton]} 
          onPress={openInMaps}
        >
          <Ionicons name="navigate-outline" size={18} color="#fff" />
          <Text style={styles.buttonText}>Open in Maps</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  const renderDirections = () => {
    if (!showDirections) return null;
    
    return (
      <View style={styles.directionsContainer}>
        <Text style={styles.directionsTitle}>Directions</Text>
        
        {directionSteps.map((step, index) => (
          <View key={step.id} style={styles.directionStep}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>{index + 1}</Text>
            </View>
            <View style={styles.stepDetails}>
              <Text style={styles.stepInstruction}>{step.instruction}</Text>
              <View style={styles.stepMetrics}>
                <Text style={styles.stepDistance}>{step.distance}</Text>
                <Text style={styles.stepTime}>{step.time}</Text>
              </View>
            </View>
          </View>
        ))}
        
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total: 450m (6 min)</Text>
        </View>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Directions</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.mapContainer}>
          <Image source={{ uri: mapPlaceholder }} style={styles.mapImage} />
          
          <View style={styles.mapOverlay}>
            <TouchableOpacity style={styles.currentLocationButton}>
              <Ionicons name="locate" size={24} color="#4e73df" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.zoomInButton}>
              <Ionicons name="add" size={24} color="#333" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.zoomOutButton}>
              <Ionicons name="remove" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
        
        {renderLocationDetails()}
        {renderDirections()}
      </ScrollView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

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
  mapContainer: {
    width: '100%',
    height: 250,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  currentLocationButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 24,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  zoomInButton: {
    position: 'absolute',
    bottom: 60,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  zoomOutButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: -30,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  locationName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  locationType: {
    fontSize: 14,
    color: '#f9a826',
    fontWeight: '500',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  locationDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 12,
  },
  coordinatesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  coordinatesText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 4,
  },
  directionsButton: {
    backgroundColor: '#4e73df',
  },
  openMapsButton: {
    backgroundColor: '#f9a826',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 6,
  },
  directionsContainer: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 12,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  directionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  directionStep: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumberContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4e73df',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumber: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepDetails: {
    flex: 1,
  },
  stepInstruction: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  stepMetrics: {
    flexDirection: 'row',
  },
  stepDistance: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  stepTime: {
    fontSize: 12,
    color: '#666',
  },
  totalContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
    paddingTop: 12,
    marginTop: 8,
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
  },
});

export default MapDirectionsScreen; 