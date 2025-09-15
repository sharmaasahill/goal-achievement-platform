# Goal Achievement Platform

A comprehensive full-stack web application that helps users break down large objectives into manageable learning journeys with AI-powered tutoring support.

## 🚀 Live Demo

- **Frontend:** [https://goal-achievement-platform.vercel.app](https://goal-achievement-platform.vercel.app)
- **Backend API:** [https://goal-achievement-platform.onrender.com](https://goal-achievement-platform.onrender.com)
- **GitHub Repository:** [https://github.com/sharmaasahill/goal-achievement-platform](https://github.com/sharmaasahill/goal-achievement-platform)

## 🎯 Demo Account

**Email:** `demo@example.com`  
**Password:** `Demo123!`

## ✨ Features

### 🔐 Authentication System
- User registration and login with email/password
- Password strength validation
- Email verification system
- JWT-based session management
- Secure logout functionality

### 🎯 Goal Management System
- **Intelligent Goal Creation:** Input your objective (e.g., "Learn machine learning")
- **Smart Journey Breakdown:** System automatically breaks goals into 6-week to 6-month journeys
- **Customizable Timelines:** Adjust duration and milestones as needed
- **Weekly Chunks:** Each journey split into manageable weekly/bi-weekly chunks
- **Progress Tracking:** Track completion for each chunk
- **Dependency Management:** Handle dependencies between learning modules

### 📅 Check-in System
- **Flexible Frequency:** Configurable check-in intervals (daily, weekly, bi-weekly)
- **Calendar Integration:** Visual calendar for scheduling check-ins
- **Reminder Notifications:** Automated progress reminders
- **Progress Assessment:** Built-in forms for progress evaluation

### 🤖 AI Avatar Tutor
- **Conversational Interface:** 2-way video chat simulation with AI avatar
- **Real-time Chat:** Instant messaging with context-aware responses
- **Learning Modules:** Theoretical content delivery and interactive Q&A
- **Personalized Examples:** AI adapts explanations to user's specific goals
- **Practice Problems:** AI generates relevant practice exercises

### 📊 Progress Tracking & Analytics
- **Comprehensive Data Recording:** All interactions and progress tracked
- **Learning Velocity:** Calculate and display learning speed metrics
- **Completion Rates:** Track success rates per module
- **Session Summaries:** Auto-generated summaries of learning sessions
- **Progress Visualization:** Charts and graphs for progress insights

### 🔔 Real-time Features
- **Live Chat:** Real-time messaging with typing indicators
- **Progress Updates:** Instant progress synchronization
- **Notifications:** Real-time notification system
- **WebSocket Integration:** Seamless real-time communication

## 🛠️ Technical Architecture

### Frontend
- **Framework:** React.js with React Router
- **Styling:** Tailwind CSS with custom design system
- **State Management:** React Context API
- **Real-time:** Socket.IO Client
- **HTTP Client:** Axios with interceptors

### Backend
- **Framework:** Node.js with Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT tokens with bcryptjs
- **Real-time:** Socket.IO Server
- **CORS:** Dynamic CORS configuration for multiple domains

### Database Schema
- **Users:** Authentication and profile data
- **Goals:** Goal definitions and journey breakdowns
- **Messages:** Chat history and AI interactions
- **Checkins:** Progress tracking and assessments
- **Notifications:** User notifications and reminders

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sharmaasahill/goal-achievement-platform.git
   cd goal-achievement-platform
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   
   Create `server/.env` file:
   ```env
   PORT=5000
   MONGO_URI=your-mongodb-connection-string
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

4. **Run the application**
   ```bash
   # Start backend server
   cd server
   npm start
   
   # Start frontend (in new terminal)
   cd client
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📱 User Journey Example

1. **Registration:** New user signs up with email/password
2. **Goal Setting:** "I want to become a data scientist"
3. **Journey Planning:** System suggests 4-month journey with weekly milestones
4. **Learning Path:** Breaks into modules (Python basics → Statistics → ML algorithms → Projects)
5. **AI Interaction:** User chats with avatar about linear regression theory
6. **Application:** Avatar helps apply concepts to user's specific dataset
7. **Progress Tracking:** System records learning, provides summary and next steps

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Email verification
- `POST /api/auth/resend-verification` - Resend verification email

### Goals
- `GET /api/goals` - Get user goals
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal
- `PATCH /api/goals/:id` - Update goal status

### AI Tutor
- `POST /api/ai/chat` - Send message to AI tutor
- `GET /api/ai/history/:goalId` - Get chat history

### Check-ins
- `GET /api/checkins/:goalId` - Get check-ins for goal
- `POST /api/checkins` - Create new check-in
- `PUT /api/checkins/:id` - Update check-in

### Notifications
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark notification as read
- `DELETE /api/notifications/:id` - Delete notification

## 🎨 Design System

### Color Palette
- **Background:** `#0f172a` (Dark slate)
- **Panel:** `#111827` (Dark gray)
- **Card:** `#0b1220` (Darker slate)
- **Accent:** `#22d3ee` (Cyan)

### Typography
- **Font Family:** Inter (Google Fonts)
- **Responsive Design:** Mobile-first approach

## 🔒 Security Features

- **Password Hashing:** bcryptjs with salt rounds
- **JWT Authentication:** Secure token-based authentication
- **CORS Protection:** Dynamic CORS configuration
- **Input Validation:** Server-side validation for all inputs
- **Environment Variables:** Secure configuration management

## 📈 Performance Optimizations

- **Code Splitting:** React lazy loading
- **Image Optimization:** Optimized assets
- **Caching:** Efficient data caching strategies
- **Real-time Updates:** WebSocket for instant updates

## 🧪 Testing

The application includes comprehensive error handling and validation:
- Form validation on both client and server
- API error handling with meaningful messages
- Real-time connection error handling
- Database connection error management

## 🚀 Deployment

### Frontend (Vercel)
- Automatic deployment from GitHub
- Environment variables configured
- Custom domain support

### Backend (Render)
- Automatic deployment from GitHub
- Environment variables configured
- MongoDB Atlas integration

## 📝 License

This project is created for educational and demonstration purposes.

## 👨‍💻 Developer

**Sahil Sharma**  
- GitHub: [@sharmaasahill](https://github.com/sharmaasahill)
- Project: Goal Achievement Platform

---

*Built with ❤️ using React, Node.js, MongoDB, and modern web technologies.*