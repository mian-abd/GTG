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
    roomNumber: '203',
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
    roomNumber: '215',
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
    roomNumber: '112',
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
    name: 'Julian Science and Mathematics Center',
    description: 'State-of-the-art facility housing science labs, classrooms, and research spaces.',
    imageUrl: 'https://www.depauw.edu/files/resources/building-julian.jpg',
    type: 'Learning Spaces',
    latitude: 39.641,
    longitude: -86.8613,
    virtualTourUrl: 'https://www.youvisit.com/tour/panoramas/depauw?id=64760&_sp=00a2aa52-c1a9-4ce5-954c-78be0f12a5e6'
  },
  {
    id: '2',
    name: 'Hoover Hall',
    description: 'Modern dining hall with multiple stations and gathering spaces for students and faculty.',
    imageUrl: 'https://www.depauw.edu/files/resources/hoover-hall-main.jpg',
    type: 'Community Spaces',
    latitude: 39.6399,
    longitude: -86.8628,
    virtualTourUrl: 'https://www.youvisit.com/tour/panoramas/depauw?id=111266&_sp=00a2aa52-c1a9-4ce5-954c-78be0f12a5e6'
  },
  {
    id: '3',
    name: 'Roy O. West Library',
    description: 'Recently renovated central library with modern study spaces and extensive collections.',
    imageUrl: 'https://www.depauw.edu/files/resources/roylibrary.jpg',
    type: 'Learning Spaces',
    latitude: 39.6402,
    longitude: -86.8612,
    virtualTourUrl: 'https://www.youvisit.com/tour/panoramas/depauw?id=111265&_sp=00a2aa52-c1a9-4ce5-954c-78be0f12a5e6'
  },
  {
    id: '4',
    name: 'Green Center for the Performing Arts',
    description: 'Complex housing music, theatre facilities and performance spaces, including Kresge Auditorium.',
    imageUrl: 'https://www.depauw.edu/files/resources/building-green.jpg',
    type: 'Arts, Performance & Production',
    latitude: 39.639,
    longitude: -86.8601,
    virtualTourUrl: 'https://www.youvisit.com/tour/panoramas/depauw?id=111273&_sp=00a2aa52-c1a9-4ce5-954c-78be0f12a5e6'
  },
  {
    id: '5',
    name: 'Lilly Center',
    description: 'Athletic and recreational facility with pools, courts, fitness areas, and wellness resources.',
    imageUrl: 'https://www.depauw.edu/files/resources/building-lilly.jpg',
    type: 'Athletics & Wellness',
    latitude: 39.6379,
    longitude: -86.8606,
    virtualTourUrl: 'https://www.youvisit.com/tour/panoramas/depauw?id=111267&_sp=00a2aa52-c1a9-4ce5-954c-78be0f12a5e6'
  },
  {
    id: '6',
    name: 'Peeler Art Center',
    description: 'Contemporary art gallery and studio spaces for visual arts programs and exhibitions.',
    imageUrl: 'https://www.depauw.edu/files/resources/building-peeler.jpg',
    type: 'Arts, Performance & Production',
    latitude: 39.6393,
    longitude: -86.8587,
    virtualTourUrl: 'https://www.youvisit.com/tour/panoramas/depauw?id=111271&_sp=00a2aa52-c1a9-4ce5-954c-78be0f12a5e6'
  },
  {
    id: '7',
    name: 'East College',
    description: 'Historic centerpiece of campus dating to 1877, housing classrooms and administrative offices.',
    imageUrl: 'https://www.depauw.edu/files/resources/building-eastcollege.jpg',
    type: 'Learning Spaces',
    latitude: 39.6407,
    longitude: -86.8598,
    virtualTourUrl: 'https://www.youvisit.com/tour/panoramas/depauw?id=111272&_sp=00a2aa52-c1a9-4ce5-954c-78be0f12a5e6'
  },
  {
    id: '8',
    name: 'Asbury Hall',
    description: 'Home to humanities departments with modern classrooms and faculty offices.',
    imageUrl: 'https://www.depauw.edu/files/resources/asbury.jpg',
    type: 'Learning Spaces',
    latitude: 39.6402,
    longitude: -86.8605,
    virtualTourUrl: 'https://www.youvisit.com/tour/panoramas/depauw?id=111276&_sp=00a2aa52-c1a9-4ce5-954c-78be0f12a5e6'
  },
  {
    id: '9',
    name: 'Harrison Hall',
    description: 'Houses media and communication facilities, including the Center for Contemporary Media.',
    imageUrl: 'https://www.depauw.edu/files/resources/building-harrison.jpg',
    type: 'Learning Spaces',
    latitude: 39.6384,
    longitude: -86.8613,
    virtualTourUrl: 'https://www.youvisit.com/tour/panoramas/depauw?id=111269&_sp=00a2aa52-c1a9-4ce5-954c-78be0f12a5e6'
  },
  {
    id: '10',
    name: 'Bowman Park',
    description: 'Central park-like area between East College and Roy O. West Library.',
    imageUrl: 'https://www.depauw.edu/files/resources/bowmanpark.jpg',
    type: 'Community Spaces',
    latitude: 39.6404,
    longitude: -86.8603,
    virtualTourUrl: 'https://www.youvisit.com/tour/panoramas/depauw?id=111280&_sp=00a2aa52-c1a9-4ce5-954c-78be0f12a5e6'
  },
  {
    id: '11',
    name: 'Memorial Student Union',
    description: 'Student hub with dining options, the bookstore, and spaces for meetings and events.',
    imageUrl: 'https://www.depauw.edu/files/resources/hub.jpg',
    type: 'Community Spaces',
    latitude: 39.6397,
    longitude: -86.8622,
    virtualTourUrl: 'https://www.youvisit.com/tour/panoramas/depauw?id=111268&_sp=00a2aa52-c1a9-4ce5-954c-78be0f12a5e6'
  },
  {
    id: '12',
    name: 'Rector Village',
    description: 'Modern suite-style residence halls located in the heart of campus.',
    imageUrl: 'https://www.depauw.edu/files/resources/rectorvillage.jpg',
    type: 'Living Spaces',
    latitude: 39.6385,
    longitude: -86.8622,
    virtualTourUrl: 'https://www.youvisit.com/tour/panoramas/depauw?id=111278&_sp=00a2aa52-c1a9-4ce5-954c-78be0f12a5e6'
  },
  {
    id: '13',
    name: 'Humbert Hall',
    description: 'First-year residence hall with traditional corridor-style rooms.',
    imageUrl: 'https://www.depauw.edu/files/resources/building-humbert.jpg',
    type: 'Living Spaces',
    latitude: 39.6371,
    longitude: -86.864,
    virtualTourUrl: 'https://www.youvisit.com/tour/panoramas/depauw?id=111284&_sp=00a2aa52-c1a9-4ce5-954c-78be0f12a5e6'
  },
  {
    id: '14',
    name: 'Ubben Quadrangle',
    description: 'Green space between Hoover Hall and Humbert Hall, serving as a gathering place.',
    imageUrl: 'https://www.depauw.edu/files/resources/campusscenes2.jpg',
    type: 'Community Spaces',
    latitude: 39.6387,
    longitude: -86.8631,
    virtualTourUrl: 'https://www.youvisit.com/tour/panoramas/depauw?id=111277&_sp=00a2aa52-c1a9-4ce5-954c-78be0f12a5e6'
  },
  {
    id: '15',
    name: 'Bloomington Street Greenway',
    description: 'Peaceful pathway connecting campus with the Nature Park and Greencastle.',
    imageUrl: 'https://www.depauw.edu/files/resources/bloomingtonstreetgreenway.jpg',
    type: 'Surrounding Areas',
    latitude: 39.6432,
    longitude: -86.8598,
    virtualTourUrl: ''
  },
  {
    id: '16',
    name: 'Reavis Stadium',
    description: 'Soccer and lacrosse stadium with synthetic turf field and spectator seating.',
    imageUrl: 'https://www.depauw.edu/files/resources/reavisstadium.jpg',
    type: 'Athletics & Wellness',
    latitude: 39.6346,
    longitude: -86.8645,
    virtualTourUrl: ''
  },
  {
    id: '17',
    name: 'Prindle Institute for Ethics',
    description: 'Serene facility in the Nature Park dedicated to ethical inquiry and discussion.',
    imageUrl: 'https://www.depauw.edu/files/resources/building-prindle.jpg',
    type: 'Learning Spaces',
    latitude: 39.6488,
    longitude: -86.8897,
    virtualTourUrl: 'https://www.youvisit.com/tour/panoramas/depauw?id=111274&_sp=00a2aa52-c1a9-4ce5-954c-78be0f12a5e6'
  },
  {
    id: '18',
    name: 'DePauw Nature Park',
    description: 'Former limestone quarry transformed into a 520-acre nature preserve with trails.',
    imageUrl: 'https://www.depauw.edu/files/resources/npquarry.jpeg',
    type: 'Surrounding Areas',
    latitude: 39.6495,
    longitude: -86.885,
    virtualTourUrl: 'https://www.youvisit.com/tour/panoramas/depauw?id=111275&_sp=00a2aa52-c1a9-4ce5-954c-78be0f12a5e6'
  },
  {
    id: '19',
    name: 'Greencastle Square',
    description: 'Historic downtown area with shops, restaurants, and community events.',
    imageUrl: 'https://www.depauw.edu/files/resources/greencastlesquare.jpg',
    type: 'Surrounding Areas',
    latitude: 39.6447,
    longitude: -86.8644,
    virtualTourUrl: ''
  },
  {
    id: '20',
    name: 'Center for Diversity and Inclusion',
    description: 'Dedicated space promoting cultural awareness, equity, and community engagement.',
    imageUrl: 'https://www.depauw.edu/files/resources/building-cdi.jpg',
    type: 'Community Spaces',
    latitude: 39.6394,
    longitude: -86.8611,
    virtualTourUrl: ''
  }
]; 