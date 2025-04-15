import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const VisitorHomeScreen = () => {
  const navigation = useNavigation();
  const { handleLogout } = useAuth();
  const { theme } = useTheme();

  const handleExplore = () => {
    navigation.navigate('ExploreTab');
  };

  const handleMentors = () => {
    navigation.navigate('MentorsTab');
  };

  const handleSchedule = () => {
    navigation.navigate('ScheduleTab');
  };

  const handleAbout = () => {
    // Navigate to About section
  };

  const handleBrowsePaths = () => {
    navigation.navigate('ExploreTab');
  };

  const handleMeetMentors = () => {
    navigation.navigate('MentorsTab');
  };

  const handleViewSchedule = () => {
    navigation.navigate('ScheduleTab');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background.primary }]}>
      <StatusBar barStyle={theme.colors.statusBar} backgroundColor={theme.colors.background.primary} />
      <View style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
        <View style={[styles.header, { 
          backgroundColor: theme.colors.background.primary,
          borderBottomColor: theme.colors.border
        }]}>
          <View style={styles.logoContainer}>
            <Ionicons name="school" size={24} color={theme.colors.primary} />
            <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>Visitor Portal</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle" size={28} color={theme.colors.text.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={[styles.welcomeBanner, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.welcomeTitle}>Welcome to DePauw Pre-College Program</Text>
            <Text style={styles.welcomeSubtitle}>Explore opportunities, connect with mentors, and discover your potential</Text>
          </View>

          <View style={styles.navigationButtonsContainer}>
            <TouchableOpacity 
              style={styles.navButton}
              onPress={handleExplore}
            >
              <View style={[styles.navButtonIcon, {backgroundColor: theme.colors.tertiary}]}>
                <Ionicons name="search" size={24} color="#FFF" />
              </View>
              <Text style={[styles.navButtonText, { color: theme.colors.text.primary }]}>Explore</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navButton}
              onPress={handleMentors}
            >
              <View style={[styles.navButtonIcon, {backgroundColor: theme.colors.secondary}]}>
                <Ionicons name="people" size={24} color="#FFF" />
              </View>
              <Text style={[styles.navButtonText, { color: theme.colors.text.primary }]}>Mentors</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navButton}
              onPress={handleSchedule}
            >
              <View style={[styles.navButtonIcon, {backgroundColor: theme.colors.accent}]}>
                <Ionicons name="calendar" size={24} color="#FFF" />
              </View>
              <Text style={[styles.navButtonText, { color: theme.colors.text.primary }]}>Schedule</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navButton}
              onPress={handleAbout}
            >
              <View style={[styles.navButtonIcon, {backgroundColor: '#8E44AD'}]}>
                <Ionicons name="information-circle" size={24} color="#FFF" />
              </View>
              <Text style={[styles.navButtonText, { color: theme.colors.text.primary }]}>About</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Program Highlights</Text>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.highlightsContainer}
          >
            <View style={[styles.highlightCard, { 
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border
            }]}>
              <View style={styles.highlightIconContainer}>
                <Ionicons name="home" size={24} color={theme.colors.primary} />
              </View>
              <Text style={[styles.highlightTitle, { color: theme.colors.text.primary }]}>Campus Life</Text>
              <Text style={[styles.highlightDescription, { color: theme.colors.text.secondary }]}>
                Experience life at DePauw University's beautiful campus
              </Text>
            </View>

            <View style={[styles.highlightCard, { 
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border
            }]}>
              <View style={styles.highlightIconContainer}>
                <Ionicons name="school" size={24} color={theme.colors.primary} />
              </View>
              <Text style={[styles.highlightTitle, { color: theme.colors.text.primary }]}>Academic Excellence</Text>
              <Text style={[styles.highlightDescription, { color: theme.colors.text.secondary }]}>
                Learn from outstanding faculty in small-group settings
              </Text>
            </View>

            <View style={[styles.highlightCard, { 
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border
            }]}>
              <View style={styles.highlightIconContainer}>
                <Ionicons name="people" size={24} color={theme.colors.primary} />
              </View>
              <Text style={[styles.highlightTitle, { color: theme.colors.text.primary }]}>Mentorship</Text>
              <Text style={[styles.highlightDescription, { color: theme.colors.text.secondary }]}>
                Connect with dedicated mentors who guide your journey
              </Text>
            </View>
          </ScrollView>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Available Resources</Text>
          </View>

          <View style={styles.resourcesContainer}>
            <View style={[styles.resourceCard, { 
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border
            }]}>
              <View style={styles.resourceIconContainer}>
                <Ionicons name="book" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.resourceContent}>
                <Text style={[styles.resourceTitle, { color: theme.colors.text.primary }]}>Learning Paths</Text>
                <Text style={[styles.resourceDescription, { color: theme.colors.text.secondary }]}>
                  Discover curated learning paths designed to help you explore academic interests
                </Text>
                <TouchableOpacity 
                  style={[styles.resourceButton, { backgroundColor: theme.colors.primary }]}
                  onPress={handleBrowsePaths}
                >
                  <Text style={styles.resourceButtonText}>Browse Paths</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.resourceCard, { 
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border
            }]}>
              <View style={styles.resourceIconContainer}>
                <Ionicons name="people" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.resourceContent}>
                <Text style={[styles.resourceTitle, { color: theme.colors.text.primary }]}>Mentorship Program</Text>
                <Text style={[styles.resourceDescription, { color: theme.colors.text.secondary }]}>
                  Connect with DePauw faculty and students for guidance and support
                </Text>
                <TouchableOpacity 
                  style={[styles.resourceButton, { backgroundColor: theme.colors.primary }]}
                  onPress={handleMeetMentors}
                >
                  <Text style={styles.resourceButtonText}>Meet Mentors</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.resourceCard, { 
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border
            }]}>
              <View style={styles.resourceIconContainer}>
                <Ionicons name="calendar" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.resourceContent}>
                <Text style={[styles.resourceTitle, { color: theme.colors.text.primary }]}>Workshops & Events</Text>
                <Text style={[styles.resourceDescription, { color: theme.colors.text.secondary }]}>
                  Join interactive workshops and special events throughout the program
                </Text>
                <TouchableOpacity 
                  style={[styles.resourceButton, { backgroundColor: theme.colors.primary }]}
                  onPress={handleViewSchedule}
                >
                  <Text style={styles.resourceButtonText}>View Schedule</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.colors.text.tertiary }]}>DePauw University Pre-College Program</Text>
          </View>
        </ScrollView>
      </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  profileButton: {
    width: 40,
    alignItems: 'flex-end',
  },
  scrollView: {
    flex: 1,
  },
  welcomeBanner: {
    padding: 20,
    paddingTop: 30,
    paddingBottom: 30,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
  },
  navigationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#2A2A2A',
  },
  navButton: {
    alignItems: 'center',
  },
  navButtonIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  navButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  highlightsContainer: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  highlightCard: {
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 8,
    width: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlightIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(249, 168, 38, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  highlightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  highlightDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
  resourcesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  resourceCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
  },
  resourceIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(249, 168, 38, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resourceDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  resourceButton: {
    alignSelf: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  resourceButtonText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
  },
});

export default VisitorHomeScreen; 