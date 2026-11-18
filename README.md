# MajdoorHub

> **A local service marketplace connecting customers with skilled workers for everyday home and maintenance services.**

MajdoorHub is a cross-platform mobile/web application built with **React Native and Expo**. It allows customers to discover local service workers, view their profiles, request services, and manage bookings. Workers can create their professional profile, manage their availability, view incoming job requests, accept jobs, and track their work and earnings.

---

## 📱 Features

### Customer

- 📱 Phone-based authentication flow
- 👤 Customer onboarding and profile
- 🔎 Search for service providers
- 🛠️ Browse service categories
- 👷 View available workers
- ⭐ View worker ratings and reviews
- 📍 View worker distance and service information
- 💰 View hourly and daily rates
- 📅 Request/book a service
- 📋 Manage bookings
- 🔔 Receive notifications
- 👤 Manage customer profile
- ⭐ Add reviews after completed services

### Worker

- 👷 Worker onboarding
- 🧰 Select professional skills/services
- 👤 Manage worker profile
- 🟢 Toggle online/offline availability
- 📋 View incoming job requests
- ✅ Accept or decline jobs
- 🔨 Manage active jobs
- 💰 Track earnings
- ⭐ View ratings and reviews
- 🛡️ Display reliability/trust information
- 🔔 Receive notifications

---

## 🛠️ Available Services

MajdoorHub currently includes mock data for multiple service categories:

- 🔧 Plumber
- ⚡ Electrician
- 🎨 Painter
- 🔨 Carpenter
- 🧹 Cleaner
- 🛡️ Pest Control
- 📺 Appliance Repair
- 🌱 Gardener
- ❄️ AC Service
- ✂️ Home Salon
- 🚚 Packers & Movers
- 🧰 Other Services

---

## 🧑‍💻 Tech Stack

| Technology | Purpose |
|---|---|
| **React Native** | Cross-platform UI |
| **Expo 55** | Development and application tooling |
| **JavaScript** | Application logic |
| **React Navigation** | Navigation and routing |
| **Zustand** | Global state management |
| **AsyncStorage** | Persistent local state |
| **Firebase** | Authentication, Firestore and Storage integration |
| **Lucide React Native** | Icons |
| **React Native Maps** | Map/location functionality |
| **Expo Location** | Location services |
| **Expo Image Picker** | Image selection |
| **React Native Web** | Web support |

---

## 📂 Project Structure

```text
MajdoorHub/
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── assets/
│   ├── adaptive-icon.png
│   ├── favicon.png
│   ├── icon.png
│   └── splash-icon.png
│
├── src/
│   ├── auth/
│   │   ├── OTPLogin.js
│   │   ├── Onboarding.js
│   │   ├── RoleSelection.js
│   │   ├── SignupQuestions.js
│   │   └── Splash.js
│   │
│   ├── customer/
│   │   ├── AllCategoriesScreen.js
│   │   ├── AllWorkersScreen.js
│   │   ├── BookingScreen.js
│   │   ├── BookingsScreen.js
│   │   ├── CustomerHome.js
│   │   ├── NotificationsScreen.js
│   │   ├── ProfileScreen.js
│   │   ├── SearchScreen.js
│   │   └── WorkerProfile.js
│   │
│   ├── navigation/
│   │   ├── AppNavigator.js
│   │   ├── AuthNavigator.js
│   │   ├── CustomerNavigator.js
│   │   └── WorkerNavigator.js
│   │
│   ├── services/
│   │   └── firebase.js
│   │
│   ├── store/
│   │   └── useStore.js
│   │
│   ├── utils/
│   │   ├── GlobalStyles.js
│   │   ├── GlobalStyles.web.js
│   │   ├── colors.js
│   │   ├── mockData.js
│   │   └── babel-plugin-clean-import-meta.js
│   │
│   └── worker/
│       ├── ActiveJob.js
│       ├── JobRequest.js
│       ├── WorkerDashboard.js
│       ├── WorkerEarnings.js
│       └── WorkerProfileEdit.js
│
├── App.js
├── app.json
├── babel.config.js
├── eas.json
├── index.js
├── metro.config.js
├── package.json
└── package-lock.json
```

---

## 🔄 Application Flow

### Authentication Flow

```text
Splash
   │
   ▼
Role Selection
   │
   ├── Customer
   │     ▼
   │   OTP Login / Signup
   │     ▼
   │   Customer Onboarding
   │     ▼
   │   Customer Home
   │
   └── Worker
         ▼
      OTP Login / Signup
         ▼
      Worker Onboarding
         ▼
      Worker Dashboard
```

The application maintains the selected user role and routes authenticated users to the appropriate customer or worker navigation stack.

---

## 👤 Customer Flow

```text
Customer Home
      │
      ├── Browse Categories
      │       │
      │       └── View Workers
      │
      ├── Search
      │       │
      │       └── Worker Profile
      │
      └── Worker Profile
              │
              ▼
        Request Service
              │
              ▼
        Booking Confirmation
              │
              ▼
          My Bookings
```

Customers can select a worker and submit a service request containing information such as:

- Job/problem description
- Preferred date
- Preferred time
- Address
- Optional images

---

## 👷 Worker Flow

```text
Worker Dashboard
       │
       ├── Online / Offline
       │
       ├── New Requests
       │       │
       │       ▼
       │   Job Request
       │       │
       │       ├── Accept
       │       │
       │       └── Decline
       │
       └── Active Jobs
               │
               ▼
           Active Job
               │
               ▼
          Work Session
```

Workers can filter available jobs according to their selected skills. Accepted jobs appear as active jobs, while pending jobs are shown as new requests.

---

## 🗃️ State Management

MajdoorHub uses **Zustand** for global application state.

The main store is located at:

```text
src/store/useStore.js
```

The store currently manages:

- Authentication state
- Current user
- User role
- Authentication persistence
- Worker/customer job data
- Job status updates
- Job decline actions
- Reviews
- Store hydration

State is persisted using **AsyncStorage**, allowing important local application state to survive application restarts.

---

## 🧪 Mock Data

The application currently uses local mock data for development and demonstration.

Main mock data is located at:

```text
src/utils/mockData.js
```

This includes:

- Service categories
- Worker profiles
- Worker ratings
- Worker reviews
- Service rates
- Worker experience
- Reliability scores
- Completed jobs
- Job requests
- Booking-related data

This makes it possible to develop and demonstrate the application's core flows without requiring a complete production backend.

---

## 🔥 Firebase

Firebase integration is located at:

```text
src/services/firebase.js
```

The project is structured to use:

- Firebase Authentication
- Cloud Firestore
- Firebase Storage

```text
Firebase
   │
   ├── Authentication
   ├── Firestore
   └── Storage
```

### ⚠️ Firebase Configuration

The repository currently contains demo Firebase configuration values.

For a real deployment, replace the configuration in:

```text
src/services/firebase.js
```

with the credentials/configuration of your own Firebase project.

Do **not** commit private credentials or sensitive Firebase configuration to a public repository if your setup contains secrets that should remain private.

---

## 🚀 Getting Started

### Prerequisites

Install the following before starting:

- Node.js
- npm
- Git
- Expo-compatible development environment

You can verify Node.js and npm:

```bash
node -v
npm -v
```

---

## 📥 Installation

Clone the repository:

```bash
git clone <your-repository-url>
```

Move into the project:

```bash
cd MajdoorHub
```

Install dependencies:

```bash
npm install
```

---

## ▶️ Run the Project

### Start Expo

```bash
npm start
```

or:

```bash
npx expo start
```

### Run on Web

```bash
npm run web
```

or:

```bash
npx expo start --web
```

### Run on Android

```bash
npm run android
```

or:

```bash
npx expo start --android
```

### Run on iOS

```bash
npm run ios
```

or:

```bash
npx expo start --ios
```

---

## 🌐 Web Deployment

The project includes a GitHub Actions workflow for deploying the Expo web build to **GitHub Pages**.

Workflow:

```text
.github/workflows/deploy.yml
```

The deployment pipeline:

1. Checks out the repository
2. Sets up Node.js 20
3. Installs npm dependencies
4. Creates the Expo web export
5. Configures GitHub Pages
6. Uploads the generated `dist` directory
7. Deploys the application

The web build command is:

```bash
npx expo export --platform web
```

The generated web application is placed in:

```text
dist/
```

---

## 🔐 Authentication

The current authentication UI uses a phone-number and OTP-based flow.

The authentication screens include:

```text
OTPLogin.js
Onboarding.js
RoleSelection.js
SignupQuestions.js
Splash.js
```

The application separates users into two primary roles:

```text
Customer
Worker
```

After authentication, the role determines which navigation stack is displayed.

---

## 🧭 Navigation Architecture

MajdoorHub uses React Navigation.

```text
AppNavigator
│
├── AuthNavigator
│
├── CustomerNavigator
│   ├── Customer Home
│   ├── Search
│   ├── Categories
│   ├── Bookings
│   ├── Notifications
│   └── Profile
│
└── WorkerNavigator
    ├── Dashboard
    ├── Jobs
    ├── Active Job
    ├── Earnings
    ├── Notifications
    └── Profile
```

---

## 📍 Location & Maps

The project includes:

- `expo-location`
- `react-native-maps`

These packages provide the foundation for location-aware service discovery and map functionality.

---

## 📸 Image Handling

The project includes `expo-image-picker` for image selection.

This can be used for features such as:

- Worker profile images
- Service/job images
- Images attached to service requests

---

## 🎨 UI & Design

The application uses centralized styling utilities:

```text
src/utils/colors.js
src/utils/GlobalStyles.js
src/utils/GlobalStyles.web.js
```

Icons are provided through:

```text
lucide-react-native
```

The UI uses reusable visual patterns such as:

- Cards
- Buttons
- Status indicators
- Worker profiles
- Rating displays
- Booking summaries
- Job request cards
- Dashboard statistics

---

## 📦 Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start the Expo development server |
| `npm run android` | Start the application for Android |
| `npm run ios` | Start the application for iOS |
| `npm run web` | Start the web version |
| `npm run build:web` | Export the production web build |

---

## 🔧 Configuration

Expo configuration is located in:

```text
app.json
```

The project is configured for:

- Portrait orientation
- Android
- iOS
- Web
- Custom application icons
- Splash screen
- GitHub Pages web base URL

---

## 🚧 Current Development Status

MajdoorHub currently contains a functional frontend prototype with:

- Customer and worker interfaces
- Authentication/onboarding screens
- Role-based navigation
- Service categories
- Worker discovery
- Worker profiles
- Booking flow
- Worker job management
- Earnings interface
- Reviews
- Notifications interface
- Local persistent state
- Firebase integration structure
- Web deployment workflow

A significant portion of the application currently relies on **mock/local data**, making it suitable for frontend development, demonstrations, and prototyping.

---

## 🔮 Future Improvements

Potential next development steps include:

- Connect customer and worker flows to a production backend
- Replace mock workers/jobs with live database data
- Implement production OTP authentication
- Complete Firebase authentication integration
- Persist bookings in Firestore or a backend API
- Implement real-time job notifications
- Add real-time worker availability
- Integrate payment processing
- Add location-based worker discovery
- Implement live maps and distance calculation
- Add worker document verification
- Add service completion workflow
- Implement customer-worker chat
- Add production review validation
- Improve security and backend authorization

---

## 🤝 Contributing

Contributions are welcome.

### 1. Fork the repository

```bash
git fork <repository-url>
```

### 2. Create a feature branch

```bash
git checkout -b feature/your-feature
```

### 3. Make your changes

Follow the existing project structure and coding style.

### 4. Test the application

Run the application locally:

```bash
npm start
```

### 5. Commit your changes

```bash
git commit -m "feat: add your feature"
```

### 6. Push your branch

```bash
git push origin feature/your-feature
```

### 7. Open a Pull Request

---

## 📄 License

This project does not currently specify a license.

If this project is intended to be publicly distributed or open source, add an appropriate `LICENSE` file and update this section accordingly.

---

## 👨‍💻 Project

**MajdoorHub**

A platform designed to make it easier for customers to find and request trusted local workers while giving skilled workers a digital platform to discover and manage service opportunities.

---

**Built with ❤️ using React Native + Expo**
