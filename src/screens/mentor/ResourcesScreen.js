import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  FlatList,
  SafeAreaView,
  Linking,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const ResourcesScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Real mentor resources - PDFs, Excel sheets, and docs
  const resources = [
    {
      id: 'handbook',
      title: 'DePauw Pre-College Mentor Handbook',
      description: 'Complete guide for mentors including expectations, policies, and best practices for supporting pre-college students.',
      category: 'handbook',
      type: 'pdf',
      size: '2.3 MB',
      pages: 42,
      lastModified: '2024-06-15'
    },
    {
      id: 'emergency',
      title: 'Emergency Contact Procedures',
      description: 'Step-by-step procedures for handling emergencies and crisis situations with students.',
      category: 'safety',
      type: 'pdf',
      size: '1.1 MB',
      pages: 8,
      lastModified: '2024-06-10'
    },
    {
      id: 'activities',
      title: 'Program Activities Schedule',
      description: 'Complete schedule of all program activities, class times, and special events.',
      category: 'schedule',
      type: 'excel',
      size: '0.8 MB',
      sheets: 5,
      lastModified: '2024-06-20'
    },
    {
      id: 'student-roster',
      title: 'Student Roster & Contact Information',
      description: 'List of all program participants with emergency contacts and important notes.',
      category: 'roster',
      type: 'excel',
      size: '0.6 MB',
      sheets: 3,
      lastModified: '2024-06-18'
    },
    {
      id: 'communication',
      title: 'Communication Guidelines',
      description: 'Best practices for communicating with students, parents, and program staff.',
      category: 'guidelines',
      type: 'doc',
      size: '0.4 MB',
      pages: 12,
      lastModified: '2024-06-08'
    },
    {
      id: 'incident-report',
      title: 'Incident Report Form',
      description: 'Form template for documenting any incidents or concerns that arise during the program.',
      category: 'forms',
      type: 'doc',
      size: '0.2 MB',
      pages: 3,
      lastModified: '2024-06-05'
    },
    {
      id: 'room-assignments',
      title: 'Room Assignments & Floor Plans',
      description: 'Student room assignments and residence hall floor plans for mentors.',
      category: 'housing',
      type: 'pdf',
      size: '1.7 MB',
      pages: 15,
      lastModified: '2024-06-12'
    },
    {
      id: 'mentor-schedule',
      title: 'Mentor Duty Schedule',
      description: 'Weekly schedule of mentor duties, coverage areas, and shift assignments.',
      category: 'schedule',
      type: 'excel',
      size: '0.5 MB',
      sheets: 2,
      lastModified: '2024-06-16'
    },
    {
      id: 'campus-map',
      title: 'Campus Map & Key Locations',
      description: 'Detailed campus map highlighting important locations for the pre-college program.',
      category: 'reference',
      type: 'pdf',
      size: '2.9 MB',
      pages: 4,
      lastModified: '2024-06-01'
    },
    {
      id: 'program-policies',
      title: 'Program Policies & Procedures',
      description: 'Official policies covering conduct, disciplinary procedures, and program expectations.',
      category: 'handbook',
      type: 'doc',
      size: '0.9 MB',
      pages: 18,
      lastModified: '2024-06-14'
    }
  ];

  // Filter resources based on search query and active category
  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get icon and color based on resource type
  const getResourceIcon = (type) => {
    switch (type) {
      case 'pdf':
        return { name: 'document-text', color: '#e74c3c' };
      case 'excel':
        return { name: 'grid', color: '#27ae60' };
      case 'doc':
        return { name: 'document', color: '#3498db' };
      default:
        return { name: 'document-outline', color: '#7f8c8d' };
    }
  };

  // Categories for filter tabs
  const categories = [
    { id: 'all', name: 'All Files' },
    { id: 'handbook', name: 'Handbook' },
    { id: 'schedule', name: 'Schedules' },
    { id: 'safety', name: 'Safety' },
    { id: 'forms', name: 'Forms' },
    { id: 'reference', name: 'Reference' }
  ];

  // Handle file opening - simulate viewing the file
  const handleOpenFile = (resource) => {
    Alert.alert(
      `Open ${resource.title}`,
      `This would open the ${resource.type.toUpperCase()} file for viewing.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Open', 
          onPress: () => {
            // In a real app, this would open a PDF viewer, Excel viewer, or Doc viewer
            console.log(`Opening ${resource.title}`);
          }
        }
      ]
    );
  };

  const renderResourceItem = ({ item }) => {
    const icon = getResourceIcon(item.type);
    
    return (
      <TouchableOpacity 
        style={[styles.resourceItem, { backgroundColor: theme.colors.background.secondary }]}
        onPress={() => handleOpenFile(item)}
      >
        <View style={styles.resourceContent}>
          <View style={[styles.resourceIconContainer, { backgroundColor: `${icon.color}15` }]}>
            <Ionicons name={icon.name} size={28} color={icon.color} />
          </View>
          
          <View style={styles.resourceInfo}>
            <Text style={[styles.resourceTitle, { color: theme.colors.text.primary }]}>{item.title}</Text>
            <Text style={[styles.resourceDescription, { color: theme.colors.text.secondary }]} numberOfLines={2}>
              {item.description}
            </Text>
            
            <View style={styles.resourceMeta}>
              <View style={styles.fileInfo}>
                <Text style={[styles.resourceType, { color: theme.colors.text.tertiary }]}>
                  {item.type.toUpperCase()}
                </Text>
                <Text style={[styles.separator, { color: theme.colors.text.tertiary }]}>•</Text>
                <Text style={[styles.resourceSize, { color: theme.colors.text.tertiary }]}>
                  {item.size}
                </Text>
                {item.pages && (
                  <>
                    <Text style={[styles.separator, { color: theme.colors.text.tertiary }]}>•</Text>
                    <Text style={[styles.resourcePages, { color: theme.colors.text.tertiary }]}>
                      {item.pages} pages
                    </Text>
                  </>
                )}
                {item.sheets && (
                  <>
                    <Text style={[styles.separator, { color: theme.colors.text.tertiary }]}>•</Text>
                    <Text style={[styles.resourcePages, { color: theme.colors.text.tertiary }]}>
                      {item.sheets} sheets
                    </Text>
                  </>
                )}
              </View>
              <Text style={[styles.resourceDate, { color: theme.colors.text.tertiary }]}>
                {new Date(item.lastModified).toLocaleDateString()}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.viewButton}
            onPress={() => handleOpenFile(item)}
          >
            <Ionicons name="eye-outline" size={22} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <View style={[styles.header, { 
        backgroundColor: theme.colors.background.secondary,
        borderBottomColor: theme.colors.border
      }]}>
        <Text style={[styles.screenTitle, { color: theme.colors.text.primary }]}>Mentor Resources</Text>
        <Text style={[styles.fileCount, { color: theme.colors.text.secondary }]}>
          {filteredResources.length} files
        </Text>
      </View>
      
      {/* Search Bar */}
      <View style={[styles.searchContainer, { 
        backgroundColor: theme.colors.background.secondary,
        borderColor: theme.colors.border
      }]}>
        <Ionicons name="search-outline" size={20} color={theme.colors.text.tertiary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text.primary }]}
          placeholder="Search files..."
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
      
      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              { backgroundColor: theme.colors.background.tertiary },
              activeCategory === category.id && { backgroundColor: theme.colors.primary }
            ]}
            onPress={() => setActiveCategory(category.id)}
          >
            <Text 
              style={[
                styles.categoryText,
                { color: theme.colors.text.secondary },
                activeCategory === category.id && { color: theme.colors.surface }
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Resource List */}
      <FlatList
        data={filteredResources}
        renderItem={renderResourceItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.resourcesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyStateContainer}>
            <Ionicons name="folder-open-outline" size={64} color={theme.colors.text.tertiary} />
            <Text style={[styles.emptyStateTitle, { color: theme.colors.text.primary }]}>No files found</Text>
            <Text style={[styles.emptyStateText, { color: theme.colors.text.secondary }]}>
              Try adjusting your search or category filters
            </Text>
          </View>
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
  fileCount: {
    fontSize: 14,
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
  categoriesScroll: {
    maxHeight: 50,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  resourcesList: {
    padding: 16,
    paddingBottom: 32,
  },
  resourceItem: {
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resourceContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  resourceIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    lineHeight: 22,
  },
  resourceDescription: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  resourceMeta: {
    flexDirection: 'column',
    gap: 4,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resourceType: {
    fontSize: 12,
    fontWeight: '600',
  },
  separator: {
    fontSize: 12,
    marginHorizontal: 6,
  },
  resourceSize: {
    fontSize: 12,
  },
  resourcePages: {
    fontSize: 12,
  },
  resourceDate: {
    fontSize: 12,
  },
  viewButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ResourcesScreen; 