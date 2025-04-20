import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  Dimensions,
  Linking,
  Alert,
  Platform,
  StatusBar,
  Animated,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

// Import location data and assets
import { LOCATIONS } from '../../utils/demoData';
import { IMAGES } from '../../assets';

// Map location names to local asset filenames - should match ExploreScreen
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

const MapDirectionsScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  // State for loading indicators
  const [isLoadingDirections, setIsLoadingDirections] = useState(false);
  const [isLoadingTour, setIsLoadingTour] = useState(false);
  
  // Find the location based on the ID passed or default to first location
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  useEffect(() => {
    // Default to first location if none specified
    const locationId = route.params?.locationId;
    
    try {
      let location;
      if (locationId) {
        location = LOCATIONS.find(loc => loc.id === locationId);
        if (!location) {
          console.warn('Location not found with ID:', locationId);
          location = LOCATIONS[0];
          Alert.alert('Location Not Found', 'The specified location could not be found. Showing default location instead.');
        }
      } else {
        location = LOCATIONS[0];
      }
      
      console.log('Selected location:', location.name, location.latitude, location.longitude);
      setSelectedLocation(location);
    } catch (error) {
      console.error('Error setting location:', error);
      setSelectedLocation(LOCATIONS[0]);
    }
    
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      })
    ]).start();
  }, [route.params?.locationId, fadeAnim, slideAnim]);
  
  const openInMaps = () => {
    if (!selectedLocation) {
      Alert.alert('Error', 'Location not available');
      return;
    }
    
    // Check if coordinates exist and are valid numbers
    if (!selectedLocation.latitude || !selectedLocation.longitude) {
      Alert.alert('Error', 'Location coordinates not available');
      return;
    }
    
    setIsLoadingDirections(true);
    
    const { latitude, longitude } = selectedLocation;
    const label = encodeURIComponent(selectedLocation.name);
    
    // Different URL schemes for iOS and Android
    let url;
    if (Platform.OS === 'ios') {
      url = `maps:0,0?q=${label}&ll=${latitude},${longitude}`;
    } else {
      url = `geo:0,0?q=${latitude},${longitude}(${label})`;
    }
    
    Linking.canOpenURL(url)
      .then(supported => {
        setIsLoadingDirections(false);
        if (supported) {
          return Linking.openURL(url);
        } else {
          // Fallback to browser-based Google Maps
          const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
          Alert.alert(
            'Maps App Not Found',
            'Would you like to open the location in Google Maps instead?',
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Open Google Maps', 
                onPress: () => Linking.openURL(fallbackUrl) 
              }
            ]
          );
        }
      })
      .catch(err => {
        setIsLoadingDirections(false);
        console.error('Error opening maps:', err);
        Alert.alert('Error', 'Could not open maps application');
      });
  };
  
  const openVirtualTour = () => {
    if (!selectedLocation) {
      Alert.alert('Error', 'Location not available');
      return;
    }
    
    // List of locations that should not have virtual tours
    const noTourLocations = [
      'East College',
      'Asbury Hall',
      'Harrison Hall',
      'Memorial Student Union',
      'Rector Village'
    ];
    
    if (noTourLocations.includes(selectedLocation.name)) {
      Alert.alert('Virtual Tour Not Available', 'This location does not have a virtual tour available at this time.');
      return;
    }
    
    // Get the appropriate virtual tour URL based on location name
    let tourUrl = null;
    
    // Match location name to the direct links provided
    switch(selectedLocation.name) {
      case 'Hoover Hall':
        tourUrl = 'https://my.matterport.com/show/?m=gvohj2Yu5Qc';
        break;
      case 'Green Center for the Performing Arts':
      case 'The Judson and Joyce Green Center for the Performing Arts':
        tourUrl = 'https://app.lapentor.com/sphere/gcpa-1690311151';
        break;
      case 'Julian Science and Mathematics Center':
      case 'The Percy L. Julian Science and Mathematics Center':
        tourUrl = 'https://my.matterport.com/show/?m=8csa1jFAgAz';
        break;
      case 'Peeler Art Center':
      case 'The Richard E. Peeler Art Center':
        tourUrl = 'https://app.lapentor.com/sphere/peeler-1690485610';
        break;
      case 'Ullem Sustainability Center and Campus Farm':
      case 'Campus Farm':
        tourUrl = 'https://app.lapentor.com/sphere/campus-farm-1687199908?scene=6490a2726886be1be502f6f7';
        break;
      case 'Lilly Center':
      case 'The Lilly Center':
        tourUrl = 'https://app.lapentor.com/sphere/lilly-center';
        break;
      case 'The Women\'s Center':
      case 'Women\'s Center':
        tourUrl = 'https://my.matterport.com/show/?m=prk65qArRCu';
        break;
      case 'DePauw Athletics Facilities':
      case 'Athletics Facilities':
        tourUrl = 'https://app.lapentor.com/sphere/athletic-fields?scene=649458ad5f1ca3bc01096197';
        break;
      case 'Center for Diversity and Inclusion':
      case 'The Justin and Darrianne Christian Center for Diversity and Inclusion':
        tourUrl = 'https://my.matterport.com/show/?m=4aWTHBxJqkQ';
        break;
      case 'McDermond Center':
      case 'The Robert C. McDermond Center for Management & Entrepreneurship':
        tourUrl = 'https://my.matterport.com/show/?m=8d2BLUcQdqT';
        break;
      case 'Pulliam Center for Contemporary Media':
      case 'The Eugene S. Pulliam Center for Contemporary Media':
        tourUrl = 'https://my.matterport.com/show/?m=8yBjcDXCkCY';
        break;
      case 'Bishop Roberts Hall':
        tourUrl = 'https://my.matterport.com/show/?m=rSnQ47VCcNR';
        break;
      case 'Eli\'s Books':
        tourUrl = 'https://app.lapentor.com/sphere/downtown-greencastle';
        break;
      case 'The Center for Spiritual Life':
      case 'Center for Spiritual Life':
        tourUrl = 'https://my.matterport.com/show/?m=NL8gQzSmiXG';
        break;
      case 'DePauw Nature Park':
      case 'Nature Park':
        tourUrl = 'https://app.lapentor.com/sphere/nature-park';
        break;
      case 'F.W. Olin Biological Sciences Building':
      case 'Olin Biological Sciences Building':
        tourUrl = 'https://www.depauw.edu/virtual-tour/location/19/';
        break;
      case 'Prindle Institute for Ethics':
      case 'The Janet Prindle Institute for Ethics':
        tourUrl = 'https://app.lapentor.com/sphere/prindle';
        break;
      case 'Roy O. West Library':
        tourUrl = 'https://www.depauw.edu/virtual-tour/location/18/';
        break;
      default:
        // Use the default virtualTourUrl from the location data if available
        tourUrl = selectedLocation.virtualTourUrl || null;
    }
    
    if (!tourUrl) {
      Alert.alert('Virtual Tour Not Available', 'This location does not have a virtual tour available at this time.');
      return;
    }
    
    console.log('Opening virtual tour:', selectedLocation.name, tourUrl);
    setIsLoadingTour(true);
    
    Linking.openURL(tourUrl)
      .then(() => {
        setIsLoadingTour(false);
      })
      .catch(err => {
        setIsLoadingTour(false);
        console.error('Error opening virtual tour:', err);
        Alert.alert('Error', 'Could not open virtual tour');
      });
  };

  // Add a helper function to check if a virtual tour is available
  const hasVirtualTour = (location) => {
    if (!location) return false;
    
    // Exclude locations that should not have virtual tours
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
    
    // Check if the location is in our list of locations with direct tour links
    const locationsWithTours = [
      'Hoover Hall',
      'Green Center for the Performing Arts',
      'Julian Science and Mathematics Center',
      'Peeler Art Center',
      'Lilly Center',
      'Roy O. West Library',
      'DePauw Nature Park',
      'Prindle Institute for Ethics',
      'Center for Diversity and Inclusion',
      'Bishop Roberts Hall'
    ];
    
    // Check by name or if virtualTourUrl exists
    return locationsWithTours.includes(location.name) || 
           Boolean(location.virtualTourUrl);
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={[styles.header, { backgroundColor: theme.colors.background.primary, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>Location Details</Text>
        <Image
          source={IMAGES.depauw_logo}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>
      
      <ScrollView style={styles.scrollView}>
        {selectedLocation ? (
          <Animated.View style={{opacity: fadeAnim, transform: [{translateY: slideAnim}]}}>
            {/* Use same image as thumbnail in ExploreScreen */}
            {locationImages[selectedLocation.name] ? (
              <Image 
                source={locationImages[selectedLocation.name]} 
                style={styles.locationImage}
                resizeMode="cover"
              />
            ) : selectedLocation.imageUrl ? (
              <Image 
                source={{ uri: selectedLocation.imageUrl }} 
                style={styles.locationImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.imagePlaceholder, { backgroundColor: theme.colors.background.tertiary }]}>
                <Ionicons name="image-outline" size={64} color={theme.colors.text.tertiary} />
              </View>
            )}
            
            <View style={[styles.locationInfoContainer, { 
              backgroundColor: theme.colors.card,
              shadowColor: theme.mode === 'dark' ? '#000' : '#555'
            }]}>
              <Text style={[styles.locationName, { color: theme.colors.text.primary }]}>
                {selectedLocation.name}
              </Text>
              
              <View style={[styles.typeContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                <Text style={[styles.typeText, { color: theme.colors.primary }]}>
                  {selectedLocation.type}
                </Text>
              </View>
              
              <Text style={[styles.locationDescription, { color: theme.colors.text.secondary }]}>
                {selectedLocation.description}
              </Text>
              
              {selectedLocation.latitude && selectedLocation.longitude && (
                <View style={[styles.coordinatesContainer, { borderTopColor: theme.colors.border }]}>
                  <Text style={[styles.coordinatesLabel, { color: theme.colors.text.tertiary }]}>
                    Location Coordinates
                  </Text>
                  <View style={styles.coordinatesRow}>
                    <Text style={[styles.coordinates, { color: theme.colors.text.secondary }]}>
                      {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
                    </Text>
                    <TouchableOpacity 
                      style={styles.copyButton}
                      onPress={() => {
                        const coordText = `${selectedLocation.latitude.toFixed(6)}, ${selectedLocation.longitude.toFixed(6)}`;
                        // In a real app, you would use Clipboard.setString(coordText)
                        Alert.alert('Copied', 'Coordinates copied to clipboard');
                      }}
                    >
                      <Ionicons name="copy-outline" size={18} color={theme.colors.text.tertiary} />
            </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
            
            <View style={styles.buttonsContainer}>
              <TouchableOpacity 
                style={[
                  styles.directionsButton, 
                  { backgroundColor: theme.colors.primary },
                  isLoadingDirections && { opacity: 0.7 }
                ]}
                onPress={openInMaps}
                disabled={isLoadingDirections || !selectedLocation.latitude || !selectedLocation.longitude}
                activeOpacity={0.7}
              >
                {isLoadingDirections ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Ionicons name="navigate" size={22} color="#fff" />
                    <Text style={styles.directionsButtonText}>Get Directions</Text>
                  </>
                )}
              </TouchableOpacity>
              
              {hasVirtualTour(selectedLocation) && (
                <TouchableOpacity 
                  style={[
                    styles.virtualTourButton, 
                    { backgroundColor: theme.colors.tertiary },
                    isLoadingTour && { opacity: 0.7 }
                  ]}
                  onPress={openVirtualTour}
                  disabled={isLoadingTour}
                  activeOpacity={0.7}
                >
                  {isLoadingTour ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Ionicons name="cube" size={22} color="#fff" />
                      <Text style={styles.virtualTourText}>Virtual Tour</Text>
                    </>
                  )}
            </TouchableOpacity>
              )}
            </View>
            
            <View style={[styles.infoSection, { borderTopColor: theme.colors.border }]}>
              <Text style={[styles.infoSectionTitle, { color: theme.colors.text.primary }]}>
                Location Information
              </Text>
              
              <View style={styles.infoRow}>
                <Ionicons name="location" size={20} color={theme.colors.primary} />
                <Text style={[styles.infoText, { color: theme.colors.text.secondary }]}>
                  Type: {selectedLocation.type}
                </Text>
              </View>
              
              {selectedLocation.latitude && selectedLocation.longitude && (
                <TouchableOpacity 
                  style={styles.infoRow} 
                  onPress={openInMaps}
                  disabled={isLoadingDirections}
                >
                  <Ionicons name="map" size={20} color={theme.colors.primary} />
                  <Text style={[styles.infoText, { color: theme.colors.text.secondary }]}>
                    Open in Maps App
                  </Text>
                  {isLoadingDirections ? (
                    <ActivityIndicator size="small" color={theme.colors.text.tertiary} />
                  ) : (
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} style={styles.chevron} />
                  )}
                </TouchableOpacity>
              )}
              
              {hasVirtualTour(selectedLocation) && (
                <TouchableOpacity 
                  style={styles.infoRow} 
                  onPress={openVirtualTour}
                  disabled={isLoadingTour}
                >
                  <Ionicons name="cube" size={20} color={theme.colors.primary} />
                  <Text style={[styles.infoText, { color: theme.colors.text.secondary }]}>
                    View Virtual Tour
                  </Text>
                  {isLoadingTour ? (
                    <ActivityIndicator size="small" color={theme.colors.text.tertiary} />
                  ) : (
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} style={styles.chevron} />
                  )}
            </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>
              Loading location details...
            </Text>
          </View>
        )}
      </ScrollView>
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
    padding: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  logoImage: {
    width: 36,
    height: 36,
  },
  scrollView: {
    flex: 1,
  },
  locationImage: {
    width: Dimensions.get('window').width,
    height: 250,
  },
  imagePlaceholder: {
    width: '100%',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationInfoContainer: {
    padding: 20,
    margin: 16,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  typeContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  locationDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  coordinatesContainer: {
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 1,
  },
  coordinatesLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  coordinatesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  coordinates: {
    fontSize: 14,
    flex: 1,
  },
  copyButton: {
    padding: 6,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 16,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    elevation: 2,
  },
  directionsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  virtualTourButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    elevation: 2,
  },
  virtualTourText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoSection: {
    margin: 16,
    marginTop: 0,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  infoSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  infoText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  chevron: {
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    marginTop: 100,
  },
  loadingText: {
    fontSize: 16,
  }
});

export default MapDirectionsScreen; 