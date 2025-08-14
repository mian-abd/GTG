# 🎓 DePauw Gatewway To Gold Pre-College Program Mobile App

> A comprehensive mobile application for DePauw University's Pre-College Summer Program, built with React Native and Expo. This app serves administrators, mentors, and students with role-based access to manage and participate in the summer program.

<div align="center">

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

</div>

## 📱 App Overview

The DePauw Pre-College Program App is a role-based mobile application designed to enhance the summer program experience for all participants. With dedicated interfaces for **Administrators**, **Mentors**, and **Students**, the app streamlines communication, scheduling, and campus navigation.

### 🎯 Key Features

#### 👨‍💼 **For Administrators**
- **Real-time Dashboard** - Monitor program statistics and activities
- **User Management** - Manage mentor and student accounts
- **Schedule Management** - Create and modify program schedules
- **Room Assignments** - Assign and track student accommodations
- **Analytics & Reporting** - View program engagement metrics
- **Firebase Integration** - Real-time data synchronization

#### 👩‍🏫 **For Mentors**
- **Mentor Portal** - Personalized dashboard with daily schedules
- **Student Management** - View assigned students and track progress
- **Resource Library** - Access to mentor handbooks and guidelines
- **Communication Tools** - Connect with students and administrators
- **Schedule Coordination** - View and manage mentor shift assignments

#### 🎓 **For Students**
- **Interactive Campus Map** - Explore DePauw University campus with 20+ locations
- **Personal Schedule** - View daily activities, classes, and events
- **Mentor Connection** - Access mentor information and contact details
- **Campus Exploration** - Discover academic buildings, residence halls, and facilities
- **Program Information** - Access to DePauw's official program resources

## 🛠️ Technical Architecture

### **Frontend Stack**
- **React Native** `0.76.9` - Cross-platform mobile development
- **Expo SDK** `~52.0.43` - Development and deployment platform
- **React Navigation** `7.x` - Navigation and routing
- **Expo Vector Icons** - Comprehensive icon library
- **TypeScript** - Type-safe development

### **Backend & Data**
- **Firebase** `11.6.0` - Real-time database and authentication
  - Firestore for data storage
  - Firebase Auth for user management
  - Cloud Storage for file uploads
- **AsyncStorage** - Local data persistence
- **Context API** - State management

### **Development Tools**
- **Expo Dev Client** - Custom development builds
- **EAS Build** - Cloud-based app compilation
- **Document Picker** - File import functionality
- **Date-fns** - Date manipulation utilities

## 📸 App Screenshots

*Note: Screenshots will be added to showcase the modern UI design and user experience across all three user roles.*

### 🎨 Design System
- **Dark/Light Theme Support** - Adaptive UI design
- **DePauw Branding** - Official university colors and assets
- **Modern UI Components** - Custom-designed interface elements
- **Responsive Design** - Optimized for various screen sizes

## 🚀 Getting Started

### Prerequisites
- **Node.js** (16.x or higher)
- **npm** or **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)
- **iOS Simulator** or **Android Emulator** (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GTG
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   expo start
   ```

4. **Run on device/emulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

### 📱 Demo Credentials

For testing purposes, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@depauw.edu` | `mortonspeople` |
| **Mentor** | `mentor@depauw.edu` | `mortonspeople` |
| **Student** | `visitor@depauw.edu` | `mortonspeople` |

## 🏗️ Project Structure

```
GTG/
├── src/
│   ├── assets/                 # Images, fonts, and static files
│   ├── components/             # Reusable UI components
│   │   ├── Button.js
│   │   ├── Card.js
│   │   ├── Header.js
│   │   └── ProfileAvatar.js
│   ├── context/                # React Context providers
│   │   ├── AuthContext.js      # Authentication state
│   │   └── ThemeContext.js     # Theme management
│   ├── navigation/             # Navigation configuration
│   │   ├── AppNavigator.js
│   │   ├── AdminNavigator.js
│   │   ├── MentorNavigator.js
│   │   └── VisitorNavigator.js
│   ├── screens/                # Screen components
│   │   ├── admin/              # Administrator screens
│   │   ├── auth/               # Authentication screens
│   │   ├── mentor/             # Mentor screens
│   │   └── visitor/            # Student screens
│   └── utils/                  # Utility functions
│       ├── firebaseConfig.js   # Firebase configuration
│       ├── scheduleService.js  # Schedule management
│       └── emailService.js     # Email integration
├── assets/                     # Campus images and assets
├── android/                    # Android-specific configuration
├── ios/                        # iOS-specific configuration
├── App.js                      # Main application component
└── package.json                # Dependencies and scripts
```

## 🔐 Authentication & Security

- **Role-based Access Control** - Three distinct user types with appropriate permissions
- **Firebase Authentication** - Secure user management
- **Token-based Sessions** - Persistent login state
- **Data Validation** - Input sanitization and validation

## 🌟 Key Features Breakdown

### 📊 **Admin Dashboard**
- Real-time statistics display
- Quick action buttons for common tasks
- Recent activity tracking
- Firebase-integrated data management

### 🗺️ **Campus Exploration**
- **20+ Campus Locations** mapped with high-quality images
- Interactive location cards with detailed information
- Category filtering (Academic, Residential, Dining)
- GPS coordinates and directions
- Virtual tour integration for select locations

### 📅 **Schedule Management**
- Dynamic schedule loading from Firebase
- Day-wise schedule organization
- Event type categorization (Classes, Meals, Activities)
- Search and filter functionality
- Real-time updates and synchronization

### 👥 **Mentor System**
- Dedicated mentor portal with personalized dashboard
- Student assignment and progress tracking
- Resource library access
- Communication tools

## 🚀 Deployment

### Mobile App Stores

The app is configured for deployment to both iOS App Store and Google Play Store using **EAS Build**:

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Build for both platforms
eas build --platform all
```

### Configuration Files
- **`app.json`** - Expo configuration
- **`eas.json`** - EAS Build configuration
- **iOS Bundle ID**: `com.depauw.gtg`
- **Android Package**: `com.depauw.gtg`

## 🔮 Future Enhancements

- [ ] **Push Notifications** - Real-time alerts and announcements
- [ ] **Offline Support** - Cached data for offline usage
- [ ] **Advanced Analytics** - Detailed usage and engagement metrics
- [ ] **Chat System** - In-app messaging between users
- [ ] **Calendar Integration** - Sync with device calendars
- [ ] **Document Management** - File sharing and document repositories
- [ ] **Biometric Authentication** - Fingerprint/Face ID login
- [ ] **Multi-language Support** - Internationalization

## 🤝 Contributing

We welcome contributions to improve the DePauw Pre-College Program App! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👥 Development Team

- **Lead Developer**: Mian Abdullah
- **Institution**: DePauw University
- **Program**: Pre-College Summer Program

## 📞 Support

For technical support or questions about the app:

- **Email**: abdullahmian549@gmail.com
- **Website**: [DePauw Pre-College Program](https://www.depauw.edu/admission-aid/visit-events/precollegeprogram/)

---

<div align="center">

**Built with ❤️ for DePauw University Pre-College Program**

*Empowering the next generation of scholars through technology*

</div>