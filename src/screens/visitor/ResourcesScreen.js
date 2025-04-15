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
import { useTheme } from '../../context/ThemeContext';

const ResourcesScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Mock resource data - this would typically come from an API or Firebase
  // ... existing code ...

  // Filter resources based on search query and active category
  // ... existing code ...

  // Get icon based on resource type
  const getResourceIcon = (type) => {
    switch (type) {
      case 'pdf':
        return { name: 'document-text', color: '#e74c3c' };
      case 'video':
        return { name: 'videocam', color: '#3498db' };
      case 'link':
        return { name: 'link', color: '#2ecc71' };
      case 'exercise':
        return { name: 'barbell', color: '#f39c12' };
      default:
        return { name: 'document', color: '#7f8c8d' };
    }
  };

  // Categories for filter tabs
  // ... existing code ...

  const renderResourceItem = ({ item }) => {
    const icon = getResourceIcon(item.type);
    
    return (
      <TouchableOpacity 
        style={[styles.resourceItem, { backgroundColor: theme.colors.card }]}
        onPress={() => {
          // Handle opening the resource
          console.log(`Opening resource: ${item.title}`);
        }}
      >
        <View style={styles.resourceContent}>
          <View style={[styles.resourceIconContainer, { backgroundColor: `${icon.color}20` }]}>
            <Ionicons name={icon.name} size={24} color={icon.color} />
          </View>
          
          <View style={styles.resourceInfo}>
            <Text style={[styles.resourceTitle, { color: theme.colors.text.primary }]}>{item.title}</Text>
            <Text style={[styles.resourceDescription, { color: theme.colors.text.secondary }]} numberOfLines={2}>{item.description}</Text>
            
            <View style={styles.resourceMeta}>
              <Text style={[styles.resourceType, { color: theme.colors.text.tertiary }]}>
                {item.type.toUpperCase()}
              </Text>
              <Text style={[styles.resourceDate, { color: theme.colors.text.tertiary }]}>
                {item.date}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
      <View style={[styles.header, { 
        backgroundColor: theme.colors.background.primary,
        borderBottomColor: theme.colors.border 
      }]}>
        <Text style={[styles.screenTitle, { color: theme.colors.text.primary }]}>Resources</Text>
      </View>
      
      {/* Search Bar */}
      <View style={[styles.searchContainer, { 
        backgroundColor: theme.colors.card, 
        borderColor: theme.colors.border 
      }]}>
        <Ionicons name="search-outline" size={20} color={theme.colors.text.tertiary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text.primary }]}
          placeholder="Search resources..."
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
              activeCategory === category.id && [styles.activeCategoryButton, { backgroundColor: theme.colors.primary }]
            ]}
            onPress={() => setActiveCategory(category.id)}
          >
            <Text 
              style={[
                styles.categoryText,
                { color: theme.colors.text.secondary },
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
            <Ionicons name="document-outline" size={64} color={theme.colors.text.tertiary} />
            <Text style={[styles.emptyStateTitle, { color: theme.colors.text.primary }]}>No resources found</Text>
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
    paddingHorizontal: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
  },
  activeCategoryButton: {
    backgroundColor: '#4e73df',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#fff',
  },
  resourcesList: {
    padding: 16,
  },
  resourceItem: {
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
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  resourceMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resourceType: {
    fontSize: 12,
    fontWeight: '500',
  },
  resourceDate: {
    fontSize: 12,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
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
  },
});

export default ResourcesScreen; 