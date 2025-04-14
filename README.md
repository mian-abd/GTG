# DePauw Pre-College Program App

A mobile application for DePauw University's pre-college summer camp program, built with React Native.

## Features

### For Administrators:
- Manage visitors and mentors
- Monitor program activities and schedules
- View analytics and program statistics
- User management and settings

### For Mentors:
- View assigned visitors/campers
- Send notifications to visitors
- Manage camper groups
- Access emergency contact information
- View visitor profiles with medical info and allergies

### For Visitors:
- View personal schedules
- See room assignments and classes
- Access campus maps and directions
- View mentor information
- Receive notifications

## Getting Started

### Prerequisites

- Node.js (14.x or higher)
- npm or yarn
- Expo CLI
- iOS or Android device/emulator

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd GTG
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Run on device:
   - Scan the QR code with Expo Go app (Android)
   - Press 'i' for iOS simulator or 'a' for Android emulator

## Technology Stack

- **Frontend**: React Native with Expo
- **UI Components**: Custom components with Ionicons
- **Navigation**: React Navigation
- **State Management**: React Context API
- **Authentication**: Custom authentication (with plans to integrate Firebase)

## Project Structure

```
GTG/
├── src/
│   ├── assets/         # Images, fonts, and other static files
│   ├── components/     # Reusable UI components
│   ├── context/        # React Context for state management
│   ├── navigation/     # Navigation configuration
│   ├── screens/        # Screen components
│   │   ├── admin/      # Admin-specific screens
│   │   ├── auth/       # Authentication screens
│   │   ├── mentor/     # Mentor-specific screens
│   │   └── visitor/    # Visitor-specific screens
│   └── utils/          # Utility functions and helpers
├── App.js              # Main application component
└── package.json        # Project dependencies
```

## Future Enhancements

- Integration with Firebase for backend data storage
- Push notifications
- Offline data persistence
- Advanced analytics dashboard
- Interactive campus map
- Schedule sharing and export

## Credentials (For Demo Purposes Only)

- **Admin**: admin@depauw.edu / mortonspeople
- **Mentor**: mentor@depauw.edu / mortonspeople
- **Visitor**: visitor@depauw.edu / mortonspeople

## Contributors

- [Your Name]

## License

This project is licensed under the MIT License. 