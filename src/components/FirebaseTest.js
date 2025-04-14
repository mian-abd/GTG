import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { 
  auth, 
  loginWithEmail, 
  logoutUser, 
  addDocument, 
  getDocuments,
  updateDocument,
  deleteDocument,
  queryDocuments 
} from '../utils/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const FirebaseTest = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [todoText, setTodoText] = useState('');
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [editing, setEditing] = useState(false);

  // Check if user is already signed in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchTodos();
      }
    });
    
    return () => unsubscribe();
  }, []);

  // Fetch todos from Firestore
  const fetchTodos = async () => {
    try {
      setLoading(true);
      // Get todos for current user only
      const conditions = [
        { field: 'userId', operator: '==', value: user.uid }
      ];
      const todoList = await queryDocuments('todos', conditions, 'createdAt', 'desc');
      setTodos(todoList);
    } catch (error) {
      console.error('Error fetching todos:', error);
      Alert.alert('Error', 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    
    try {
      setLoading(true);
      const userCredential = await loginWithEmail(email, password);
      setUser(userCredential);
    } catch (error) {
      console.error('Sign in error:', error);
      Alert.alert('Sign in error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const handleSignOut = async () => {
    try {
      setLoading(true);
      await logoutUser();
      setUser(null);
      setTodos([]);
    } catch (error) {
      console.error('Sign out error:', error);
      Alert.alert('Error', 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  // Add new todo to Firestore
  const handleAddTodo = async () => {
    if (!todoText.trim() || !user) return;
    
    try {
      setLoading(true);
      await addDocument('todos', {
        text: todoText,
        userId: user.uid,
        completed: false
      });
      setTodoText('');
      fetchTodos();
    } catch (error) {
      console.error('Add todo error:', error);
      Alert.alert('Error', 'Failed to add todo');
    } finally {
      setLoading(false);
    }
  };

  // Toggle todo completed status
  const handleToggleComplete = async (todo) => {
    try {
      setLoading(true);
      await updateDocument('todos', todo.id, {
        completed: !todo.completed
      });
      await fetchTodos();
    } catch (error) {
      console.error('Toggle complete error:', error);
      Alert.alert('Error', 'Failed to update todo');
    } finally {
      setLoading(false);
    }
  };

  // Select todo for editing
  const handleSelectForEdit = (todo) => {
    setSelectedTodo(todo);
    setTodoText(todo.text);
    setEditing(true);
  };

  // Update todo text
  const handleUpdateTodo = async () => {
    if (!todoText.trim() || !selectedTodo) return;
    
    try {
      setLoading(true);
      await updateDocument('todos', selectedTodo.id, {
        text: todoText
      });
      setTodoText('');
      setSelectedTodo(null);
      setEditing(false);
      fetchTodos();
    } catch (error) {
      console.error('Update todo error:', error);
      Alert.alert('Error', 'Failed to update todo');
    } finally {
      setLoading(false);
    }
  };

  // Delete todo
  const handleDeleteTodo = async (todo) => {
    try {
      setLoading(true);
      await deleteDocument('todos', todo.id);
      fetchTodos();
    } catch (error) {
      console.error('Delete todo error:', error);
      Alert.alert('Error', 'Failed to delete todo');
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setTodoText('');
    setSelectedTodo(null);
    setEditing(false);
  };

  // Render todo item
  const renderTodoItem = ({ item }) => (
    <View style={styles.todoItem}>
      <TouchableOpacity 
        style={styles.todoCheckbox}
        onPress={() => handleToggleComplete(item)}
      >
        <View style={[
          styles.checkbox, 
          item.completed && styles.checkboxChecked
        ]}>
          {item.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>
      
      <Text style={[
        styles.todoText,
        item.completed && styles.todoTextCompleted
      ]}>
        {item.text}
      </Text>
      
      <View style={styles.todoActions}>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => handleSelectForEdit(item)}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDeleteTodo(item)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Test</Text>
      
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4285F4" />
        </View>
      )}
      
      {!user ? (
        // Authentication section
        <View style={styles.authContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity 
            style={styles.button}
            onPress={handleSignIn}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Todo list section
        <View style={styles.todoContainer}>
          <Text style={styles.userEmail}>Signed in as: {user.email}</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.todoInput]}
              placeholder={editing ? "Update Todo" : "New Todo"}
              value={todoText}
              onChangeText={setTodoText}
            />
            
            {editing ? (
              <View style={styles.editButtons}>
                <TouchableOpacity 
                  style={[styles.addButton, styles.updateButton]}
                  onPress={handleUpdateTodo}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.addButton, styles.cancelButton]}
                  onPress={handleCancelEdit}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.addButton}
                onPress={handleAddTodo}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {todos.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No todos yet. Add your first one!</Text>
            </View>
          ) : (
            <FlatList
              data={todos}
              keyExtractor={(item) => item.id}
              renderItem={renderTodoItem}
              style={styles.todoList}
            />
          )}
          
          <TouchableOpacity 
            style={styles.signOutButton}
            onPress={handleSignOut}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  authContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  todoContainer: {
    flex: 1,
    width: '100%',
  },
  userEmail: {
    marginBottom: 20,
    fontSize: 16,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  todoInput: {
    flex: 1,
    marginBottom: 0,
    marginRight: 10,
  },
  editButtons: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
  },
  updateButton: {
    backgroundColor: '#FF9800',
    marginBottom: 5,
  },
  cancelButton: {
    backgroundColor: '#9E9E9E',
  },
  todoList: {
    flex: 1,
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  todoItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
  },
  todoCheckbox: {
    marginRight: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#4285F4',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4285F4',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
  },
  todoText: {
    fontSize: 16,
    flex: 1,
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  todoActions: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#FF9800',
    padding: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  editButtonText: {
    color: 'white',
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 8,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
  },
  signOutButton: {
    backgroundColor: '#F44336',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default FirebaseTest; 