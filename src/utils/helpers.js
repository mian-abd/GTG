// Helper utility functions

/**
 * Format a date to a readable string
 * @param {Date|string} date - Date to format
 * @param {string} format - Format to use
 * @returns {string} Formatted date
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  switch (format) {
    case 'full':
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'medium':
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    case 'short':
    default:
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
  }
};

/**
 * Format a time string
 * @param {string} time - Time to format (e.g., "09:00")
 * @returns {string} Formatted time (e.g., "9:00 AM")
 */
export const formatTime = (time) => {
  if (!time) return '';
  
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  
  return `${formattedHour}:${minutes} ${ampm}`;
};

/**
 * Get initials from a name
 * @param {string} name - Full name
 * @returns {string} Initials
 */
export const getInitials = (name) => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
};

/**
 * Truncate text to a specific length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  
  return text.slice(0, length - 3) + '...';
};

/**
 * Generate a random color
 * @returns {string} Random hex color
 */
export const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

/**
 * Sort array of objects by a property
 * @param {Array} array - Array to sort
 * @param {string} key - Key to sort by
 * @param {boolean} ascending - Sort ascending or descending
 * @returns {Array} Sorted array
 */
export const sortByKey = (array, key, ascending = true) => {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return ascending ? -1 : 1;
    if (a[key] > b[key]) return ascending ? 1 : -1;
    return 0;
  });
};

/**
 * Filter array of objects by search term
 * @param {Array} array - Array to filter
 * @param {string} searchTerm - Search term
 * @param {Array} keys - Keys to search in
 * @returns {Array} Filtered array
 */
export const filterBySearchTerm = (array, searchTerm, keys) => {
  if (!searchTerm) return array;
  
  const term = searchTerm.toLowerCase();
  return array.filter(item => {
    return keys.some(key => {
      const value = item[key];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(term);
      }
      return false;
    });
  });
}; 