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
  Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ResourcesScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Mock resource data - this would typically come from an API or Firebase
  const resources = [
    {
      id: 'res1',
      title: 'Mentor Handbook 2023',
      description: 'Comprehensive guide for mentors, including policies and best practices.',
      category: 'guides',
      type: 'pdf',
      url: 'https://example.com/mentorhandbook.pdf',
      dateAdded: '2023-05-15',
      size: '2.4 MB',
      thumbnail: null
    },
    {
      id: 'res2',
      title: 'Student Support Training Materials',
      description: 'Training materials to help mentors provide better support to students.',
      category: 'training',
      type: 'pptx',
      url: 'https://example.com/training.pptx',
      dateAdded: '2023-05-10',
      size: '5.7 MB',
      thumbnail: null
    },
    {
      id: 'res3',
      title: 'Crisis Intervention Protocol',
      description: 'Guidelines for handling student crises and emergencies.',
      category: 'guides',
      type: 'pdf',
      url: 'https://example.com/crisis.pdf',
      dateAdded: '2023-04-22',
      size: '1.2 MB',
      thumbnail: null
    },
    {
      id: 'res4',
      title: 'Effective Communication with Students',
      description: 'Video workshop on improving communication with students.',
      category: 'training',
      type: 'video',
      url: 'https://example.com/communication.mp4',
      dateAdded: '2023-04-18',
      size: '125 MB',
      thumbnail: null
    },
    {
      id: 'res5',
      title: 'Academic Year Calendar',
      description: 'Important dates for the academic year, including holidays and exam periods.',
      category: 'admin',
      type: 'pdf',
      url: 'https://example.com/calendar.pdf',
      dateAdded: '2023-03-30',
      size: '0.8 MB',
      thumbnail: null
    },
    {
      id: 'res6',
      title: 'Campus Resources Guide',
      description: 'Directory of campus resources to help direct students to appropriate services.',
      category: 'guides',
      type: 'pdf',
      url: 'https://example.com/resources.pdf',
      dateAdded: '2023-03-15',
      size: '3.2 MB',
      thumbnail: null
    },
    {
      id: 'res7',
      title: 'Mentoring Best Practices',
      description: 'Research-based approaches to effective mentoring.',
      category: 'training',
      type: 'video',
      url: 'https://example.com/bestpractices.mp4',
      dateAdded: '2023-02-28',
      size: '98 MB',
      thumbnail: null
    },
    {
      id: 'res8',
      title: 'Forms and Templates',
      description: 'Collection of forms and templates for mentor-student interactions.',
      category: 'admin',
      type: 'zip',
      url: 'https://example.com/forms.zip',
      dateAdded: '2023-02-10',
      size: '4.5 MB',
      thumbnail: null
    },
  ];

  // Filter resources based on search query and active category
  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get icon based on resource type
  const getResourceIcon = (type) => {
    switch (type) {
      case 'pdf':
        return { name: 'document-text', color: '#e74c3c' };
      case 'video':
        return { name: 'videocam', color: '#3498db' };
      case 'pptx':
        return { name: 'stats-chart', color: '#e67e22' };
      case 'zip':
        return { name: 'folder', color: '#9b59b6' };
      default:
        return { name: 'document', color: '#7f8c8d' };
    }
  };

  // Categories for filter tabs
  const categories = [
    { id: 'all', name: 'All Resources' },
    { id: 'guides', name: 'Guides' },
    { id: 'training', name: 'Training' },
    { id: 'admin', name: 'Administrative' },
  ];

  const renderResourceItem = ({ item }) => {
    const icon = getResourceIcon(item.type);
    
    return (
      <TouchableOpacity 
        style={styles.resourceItem}
        onPress={() => {
          // Handle opening the resource - would typically open a PDF viewer or video player
          console.log(`Opening resource: ${item.title}`);
        }}
      >
        <View style={styles.resourceContent}>
          <View style={[styles.resourceIconContainer, { backgroundColor: `${icon.color}20` }]}>
            <Ionicons name={icon.name} size={24} color={icon.color} />
          </View>
          
          <View style={styles.resourceInfo}>
            <Text style={styles.resourceTitle}>{item.title}</Text>
            <Text style={styles.resourceDescription} numberOfLines={2}>{item.description}</Text>
            
            <View style={styles.resourceMeta}>
              <Text style={styles.resourceType}>
                {item.type.toUpperCase()} • {item.size}
              </Text>
              <Text style={styles.resourceDate}>
                Added: {new Date(item.dateAdded).toLocaleDateString()}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.downloadButton}>
            <Ionicons name="cloud-download-outline" size={22} color="#4e73df" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Resources</Text>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search resources..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#999" />
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
              activeCategory === category.id && styles.activeCategoryButton
            ]}
            onPress={() => setActiveCategory(category.id)}
          >
            <Text 
              style={[
                styles.categoryText,
                activeCategory === category.id && styles.activeCategoryText
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
            <Ionicons name="document-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateTitle}>No resources found</Text>
            <Text style={styles.emptyStateText}>
              Try adjusting your search or category filters
            </Text>
          </View>
        }
      />
      
      {/* Upload FAB */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => console.log('Upload new resource')}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  categoriesScroll: {
    maxHeight: 50,
  },
  categoriesContainer: {
    paddingHorizontal: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeCategoryButton: {
    backgroundColor: '#4e73df',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeCategoryText: {
    color: '#fff',
  },
  resourcesList: {
    padding: 16,
  },
  resourceItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  resourceContent: {
    flexDirection: 'row',
    padding: 16,
  },
  resourceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
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
    color: '#333',
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  resourceMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resourceType: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  resourceDate: {
    fontSize: 12,
    color: '#888',
  },
  downloadButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4e73df',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
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

export default ResourcesScreen; 