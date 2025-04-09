// Demo data for the app

export const MENTORS = [
  { 
    id: '1', 
    name: 'Dr. Sarah Reynolds', 
    department: 'Computer Science',
    email: 'sreynolds@depauw.edu',
    students: ['1', '2', '3'],
    profileImageUrl: null,
    biography: 'Professor of Computer Science with over 15 years of teaching experience. Specializes in artificial intelligence and machine learning.',
  },
  { 
    id: '2', 
    name: 'Prof. Robert Chen', 
    department: 'Biology',
    email: 'rchen@depauw.edu',
    students: ['4', '5'],
    profileImageUrl: null,
    biography: 'Associate Professor of Biology with research focused on molecular biology and genetics. Passionate about undergraduate research.',
  },
  { 
    id: '3', 
    name: 'Dr. Lisa Johnson', 
    department: 'Chemistry',
    email: 'ljohnson@depauw.edu',
    students: ['6', '7', '8'],
    profileImageUrl: null,
    biography: 'Chair of the Chemistry department with expertise in organic chemistry. Has mentored over 50 undergraduate research projects.',
  },
  { 
    id: '4', 
    name: 'Prof. Michael Thompson', 
    department: 'Mathematics',
    email: 'mthompson@depauw.edu',
    students: ['9', '10'],
    profileImageUrl: null,
    biography: 'Professor of Mathematics specializing in statistics and data analysis. Enjoys making complex concepts accessible to students.',
  },
  { 
    id: '5', 
    name: 'Dr. James Wilson', 
    department: 'Physics',
    email: 'jwilson@depauw.edu',
    students: ['11', '12'],
    profileImageUrl: null,
    biography: 'Professor of Physics with expertise in quantum mechanics and theoretical physics. Known for innovative teaching methods.',
  },
];

export const STUDENTS = [
  { 
    id: '1', 
    name: 'John Doe', 
    email: 'jdoe_2027@depauw.edu',
    department: 'Computer Science', 
    mentorId: '1',
    progress: 77, 
    profileImageUrl: null,
    medicalInfo: 'No allergies or medical conditions',
    emergencyContact: 'Jane Doe, 555-123-4567, Mother',
    roomAssignment: 'Hoover Hall, Room 203',
    classSchedule: ['CS101', 'MATH142', 'COMM210'],
  },
  { 
    id: '2', 
    name: 'Jane Smith', 
    email: 'jsmith_2027@depauw.edu',
    department: 'Biology', 
    mentorId: '1',
    progress: 42, 
    profileImageUrl: null,
    medicalInfo: 'Penicillin allergy',
    emergencyContact: 'Robert Smith, 555-987-6543, Father',
    roomAssignment: 'Hoover Hall, Room 215',
    classSchedule: ['BIO101', 'CHEM120', 'ENG101'],
  },
  { 
    id: '3', 
    name: 'Mike Johnson', 
    email: 'mjohnson_2027@depauw.edu',
    department: 'Physics', 
    mentorId: '1',
    progress: 89, 
    profileImageUrl: null,
    medicalInfo: 'Asthma, carries inhaler',
    emergencyContact: 'Sarah Johnson, 555-246-8102, Mother',
    roomAssignment: 'Julian Hall, Room 112',
    classSchedule: ['PHYS101', 'MATH241', 'CS142'],
  },
];

export const ACTIVITIES = [
  { 
    id: '1', 
    name: 'Campus Tour', 
    date: '2023-06-15', 
    time: '09:00',
    location: 'Main Campus', 
    participants: ['1', '2', '3', '4', '5'],
    description: 'A guided tour of the DePauw University campus highlighting key academic buildings, residence halls, and recreational facilities.',
  },
  { 
    id: '2', 
    name: 'Welcome Dinner', 
    date: '2023-06-16', 
    time: '18:00',
    location: 'Dining Hall', 
    participants: ['1', '2', '3', '4', '5'],
    description: 'Formal welcome dinner with faculty, mentors, and students. Program overview will be presented.',
  },
  { 
    id: '3', 
    name: 'Team Building', 
    date: '2023-06-17', 
    time: '13:00',
    location: 'Sports Center', 
    participants: ['1', '2', '3', '4', '5'],
    description: 'Interactive team-building activities designed to help students get to know each other and develop collaboration skills.',
  },
  { 
    id: '4', 
    name: 'Research Symposium', 
    date: '2023-06-20', 
    time: '10:00',
    location: 'Science Center', 
    participants: ['1', '2', '3', '4', '5'],
    description: 'Students will present research proposals and get feedback from faculty mentors.',
  },
  { 
    id: '5', 
    name: 'Career Panel', 
    date: '2023-06-22', 
    time: '14:00',
    location: 'Auditorium', 
    participants: ['1', '2', '3', '4', '5'],
    description: 'Alumni panel discussion about career paths and professional development opportunities.',
  },
];

export const CLASSES = [
  {
    id: 'CS101',
    name: 'Introduction to Computer Science',
    instructor: 'Dr. Sarah Reynolds',
    schedule: {
      date: '2023-06-19',
      time: '10:00'
    },
    location: 'Julian Science Center 103',
    description: 'Fundamentals of programming and algorithmic problem-solving using Python.',
  },
  {
    id: 'MATH142',
    name: 'Calculus I',
    instructor: 'Prof. Michael Thompson',
    schedule: {
      date: '2023-06-20',
      time: '09:00'
    },
    location: 'Asbury Hall 202',
    description: 'Introduction to differential and integral calculus of functions of one variable.',
  },
  {
    id: 'BIO101',
    name: 'Principles of Biology',
    instructor: 'Prof. Robert Chen',
    schedule: {
      date: '2023-06-19',
      time: '13:00'
    },
    location: 'Julian Science Center 205',
    description: 'Introduction to cell biology, genetics, evolution, and ecology.',
  },
  {
    id: 'CHEM120',
    name: 'General Chemistry',
    instructor: 'Dr. Lisa Johnson',
    schedule: {
      date: '2023-06-20',
      time: '13:00'
    },
    location: 'Julian Science Center 310',
    description: 'Fundamental principles of chemistry, including atomic structure, bonding, and stoichiometry.',
  },
  {
    id: 'PHYS101',
    name: 'Introduction to Physics',
    instructor: 'Dr. James Wilson',
    schedule: {
      date: '2023-06-19',
      time: '09:00'
    },
    location: 'Julian Science Center 110',
    description: 'Basic principles of mechanics, heat, and sound.',
  },
];

export const LOCATIONS = [
  {
    id: '1',
    name: 'Julian Science Center',
    type: 'Academic',
    description: 'Houses the departments of Biology, Chemistry, Computer Science, Physics, and Mathematics.',
    imageUrl: null,
    coordinates: { latitude: 39.6436, longitude: -86.8625 },
  },
  {
    id: '2',
    name: 'Hoover Hall',
    type: 'Residential',
    description: 'Primary residence hall for summer program participants.',
    imageUrl: null,
    coordinates: { latitude: 39.6425, longitude: -86.8630 },
  },
  {
    id: '3',
    name: 'Dining Hall',
    type: 'Dining',
    description: 'Main dining facility serving breakfast, lunch, and dinner.',
    imageUrl: null,
    coordinates: { latitude: 39.6430, longitude: -86.8635 },
  },
  {
    id: '4',
    name: 'Sports Center',
    type: 'Recreation',
    description: 'Indoor and outdoor sports facilities including a gym, pool, and fields.',
    imageUrl: null,
    coordinates: { latitude: 39.6445, longitude: -86.8640 },
  },
  {
    id: '5',
    name: 'Auditorium',
    type: 'Event',
    description: 'Main venue for large group presentations and events.',
    imageUrl: null,
    coordinates: { latitude: 39.6440, longitude: -86.8620 },
  },
]; 