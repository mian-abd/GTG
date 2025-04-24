import { 
  db, 
  addDocument, 
  updateDocument, 
  deleteDocument, 
  getDocuments,
  queryDocuments
} from './firebaseConfig';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { format, parseISO } from 'date-fns';

// Define the program session dates
export const SESSION_DATES = [
  '2023-07-17', // Day 1
  '2023-07-18'  // Day 2
];

// Define a fixed daily schedule that will be applied to both days
const DAILY_SCHEDULE = [
  {
    title: 'Breakfast',
    startTime: '07:30',
    endTime: '08:30',
    type: 'meal',
    description: 'Breakfast in the dining hall',
    location: 'Hoover Hall',
    isEditable: false
  },
  {
    title: 'Morning Session',
    startTime: '09:00',
    endTime: '11:30',
    type: 'session',
    description: 'Academic workshop and activities',
    location: 'Julian Science Center',
    isEditable: true
  },
  {
    title: 'Lunch',
    startTime: '12:00',
    endTime: '13:00',
    type: 'meal',
    description: 'Lunch in the dining hall',
    location: 'Hoover Hall',
    isEditable: false
  },
  {
    title: 'Afternoon Session',
    startTime: '13:30',
    endTime: '16:00',
    type: 'session',
    description: 'Lab work and group activities',
    location: 'Julian Science Center',
    isEditable: true
  },
  {
    title: 'Free Time',
    startTime: '16:00',
    endTime: '17:30',
    type: 'free',
    description: 'Personal time for study or recreation',
    location: 'Various Locations',
    isEditable: false
  },
  {
    title: 'Dinner',
    startTime: '18:00',
    endTime: '19:00',
    type: 'meal',
    description: 'Dinner in the dining hall',
    location: 'Hoover Hall',
    isEditable: false
  },
  {
    title: 'Evening Activities',
    startTime: '19:30',
    endTime: '21:30',
    type: 'activity',
    description: 'Organized social and team-building activities',
    location: 'Student Union',
    isEditable: true
  }
];

/**
 * Initialize the schedule with default items
 * @param {boolean} force - Whether to force re-initialization even if data exists
 * @returns {Promise<boolean>} Success status
 */
export const initializeSchedule = async (force = false) => {
  try {
    console.log('Initializing schedule...');
    
    // First check if we already have schedule items
    const existingSchedule = await getDocuments('schedules');
    
    // If we have data and force is false, don't reinitialize
    if (existingSchedule.length > 0 && !force) {
      console.log('Schedule already exists. Use force=true to reinitialize.');
      return true;
    }
    
    // If force is true, delete existing schedule items
    if (existingSchedule.length > 0 && force) {
      console.log('Force reinitialization. Deleting existing schedule...');
      
      // Delete all existing schedule items
      const scheduleQuery = query(collection(db, 'schedules'));
      const querySnapshot = await getDocs(scheduleQuery);
      
      const deletePromises = [];
      querySnapshot.forEach((doc) => {
        deletePromises.push(deleteDoc(doc.ref));
      });
      
      await Promise.all(deletePromises);
      console.log('Existing schedule deleted.');
    }
    
    // Add schedule items for each day
    const addPromises = [];
    
    // Day 1
    DAILY_SCHEDULE.forEach((item) => {
      const day1Item = {
        ...item,
        date: SESSION_DATES[0],
        day: 1,
        createdAt: new Date().toISOString()
      };
      addPromises.push(addDocument('schedules', day1Item));
    });
    
    // Day 2
    DAILY_SCHEDULE.forEach((item) => {
      const day2Item = {
        ...item,
        date: SESSION_DATES[1],
        day: 2,
        createdAt: new Date().toISOString()
      };
      addPromises.push(addDocument('schedules', day2Item));
    });
    
    await Promise.all(addPromises);
    console.log('Schedule initialized successfully with', addPromises.length, 'items.');
    
    return true;
  } catch (error) {
    console.error('Error initializing schedule:', error);
    return false;
  }
};

/**
 * Get schedule items for a specific day
 * @param {number} day - Day number (1 or 2)
 * @returns {Promise<Array>} Schedule items
 */
export const getScheduleByDay = async (day) => {
  try {
    const conditions = [
      {
        field: 'day',
        operator: '==',
        value: day
      }
    ];
    
    const items = await queryDocuments('schedules', conditions, 'startTime', 'asc');
    return items;
  } catch (error) {
    console.error('Error getting schedule by day:', error);
    return [];
  }
};

/**
 * Get schedule items for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Array>} Schedule items
 */
export const getScheduleByDate = async (date) => {
  try {
    const conditions = [
      {
        field: 'date',
        operator: '==',
        value: date
      }
    ];
    
    const items = await queryDocuments('schedules', conditions, 'startTime', 'asc');
    return items;
  } catch (error) {
    console.error('Error getting schedule by date:', error);
    return [];
  }
};

/**
 * Add a new schedule item
 * @param {Object} item - Schedule item
 * @returns {Promise<string|null>} ID of the new item or null on error
 */
export const addScheduleItem = async (item) => {
  try {
    // Ensure the item has all required fields
    const scheduleItem = {
      ...item,
      createdAt: new Date().toISOString()
    };
    
    const id = await addDocument('schedules', scheduleItem);
    return id;
  } catch (error) {
    console.error('Error adding schedule item:', error);
    return null;
  }
};

/**
 * Update an existing schedule item
 * @param {string} id - Item ID
 * @param {Object} item - Updated item data
 * @returns {Promise<boolean>} Success status
 */
export const updateScheduleItem = async (id, item) => {
  try {
    const success = await updateDocument('schedules', id, {
      ...item,
      updatedAt: new Date().toISOString()
    });
    
    return success;
  } catch (error) {
    console.error('Error updating schedule item:', error);
    return false;
  }
};

/**
 * Delete a schedule item
 * @param {string} id - Item ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteScheduleItem = async (id) => {
  try {
    const success = await deleteDocument('schedules', id);
    return success;
  } catch (error) {
    console.error('Error deleting schedule item:', error);
    return false;
  }
};

/**
 * Format date for display
 * @param {string} dateString - Date string
 * @param {string} formatString - Format string for date-fns
 * @returns {string} Formatted date
 */
export const formatScheduleDate = (dateString, formatString = 'EEEE, MMMM d, yyyy') => {
  try {
    if (!dateString) return 'TBD';
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString || 'TBD';
  }
};

/**
 * Format time for display
 * @param {string} timeString - Time string (HH:MM)
 * @returns {string} Formatted time
 */
export const formatScheduleTime = (timeString) => {
  try {
    if (!timeString) return 'TBD';
    
    // Handle different time formats
    let time = timeString;
    
    // If time is ISO string with date part, extract just the time
    if (timeString.includes('T')) {
      time = timeString.split('T')[1].substring(0, 5);
    }
    
    // Extract hours and minutes
    const parts = time.split(':');
    if (parts.length !== 2) return timeString; // Return original if invalid format
    
    let hours = parseInt(parts[0], 10);
    let minutes = parseInt(parts[1], 10);
    
    // Check if the parsing was successful
    if (isNaN(hours) || isNaN(minutes)) return timeString;
    
    // Format with AM/PM
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch (error) {
    console.error('Error formatting time:', error, timeString);
    return timeString || 'TBD';
  }
}; 