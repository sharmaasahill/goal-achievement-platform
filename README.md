# Goal Achievement Platform

A comprehensive full-stack application that helps users break down large objectives into manageable learning journeys with AI-powered tutoring support.

## 🚀 Features

### ✅ Core Features Implemented

1. **Authentication System**
   - User registration with email verification
   - Secure login with JWT tokens
   - Password strength validation
   - Session management

2. **Goal Management System**
   - Intelligent goal creation with auto-suggested timelines
   - Context-aware journey breakdown (6-24 weeks)
   - Progress tracking with completion percentages
   - Flexible check-in frequency settings

3. **AI Avatar Tutor**
   - Context-aware conversational AI
   - Personalized responses based on goal type
   - Chat history storage per goal
   - Real-time guidance and support

4. **Progress Tracking & Analytics**
   - Detailed progress visualization
   - Learning velocity calculations
   - Achievement tracking
   - Timeline management

5. **Check-in System**
   - Flexible frequency settings (daily/weekly/bi-weekly)
   - Progress assessment forms
   - Reminder notifications

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

### Frontend
- **React.js** with React Router
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Context API** for state management

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/goal-achievement-platform
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system

5. **Start the server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

## 🎯 Usage

### Getting Started

1. **Register a new account**
   - Visit the registration page
   - Enter your details with a strong password
   - Verify your email (check console for development token)

2. **Create your first goal**
   - Click "New Goal" in the dashboard
   - Enter your objective (e.g., "Become a Data Scientist")
   - The system will auto-suggest a timeline and breakdown

3. **Start learning with AI tutor**
   - Select your goal from the sidebar
   - Chat with the AI tutor for personalized guidance
   - Track your progress by completing weekly chunks

### Sample Goals

The system provides intelligent breakdowns for:
- **Data Science**: 16-week structured path from statistics to ML deployment
- **Full-Stack Development**: 12-week journey from HTML/CSS to deployment
- **DSA (Data Structures & Algorithms)**: 12-week algorithm mastery path
- **Generic Goals**: Customizable weekly milestones

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Email verification
- `POST /api/auth/resend-verification` - Resend verification email

### Goals
- `GET /api/goals` - Get user's goals
- `POST /api/goals` - Create new goal
- `GET /api/goals/:id` - Get specific goal
- `PATCH /api/goals/:id/chunk/:weekIndex` - Update chunk completion
- `PATCH /api/goals/:id/checkin` - Update check-in frequency

### AI Tutor
- `POST /api/ai/reply` - Send message to AI tutor
- `GET /api/ai/history/:goalId` - Get chat history

### Check-ins
- `POST /api/checkins` - Create/update check-in schedule
- `GET /api/checkins/upcoming` - Get upcoming check-ins

## 🎨 UI/UX Features

- **Modern Dark Theme**: Sleek dark interface with cyan accents
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Chat**: Smooth chat interface with AI tutor
- **Progress Visualization**: Interactive progress bars and analytics
- **Error Handling**: Comprehensive error messages and loading states
- **Accessibility**: Keyboard navigation and screen reader support

## 🔒 Security Features

- **Password Validation**: Strong password requirements
- **JWT Authentication**: Secure token-based authentication
- **Email Verification**: Optional email verification system
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for secure cross-origin requests

## 📊 Analytics & Insights

- **Progress Tracking**: Real-time progress calculation
- **Learning Velocity**: Track learning speed and consistency
- **Achievement System**: Visual feedback for completed milestones
- **Timeline Management**: Estimated completion dates
- **Streak Tracking**: Daily learning streak monitoring

## 🚀 Deployment

### Environment Variables for Production

```env
PORT=5000
MONGO_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-production-jwt-secret
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
```

### Build Commands

**Frontend:**
```bash
cd client
npm run build
```

**Backend:**
```bash
cd server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🎯 Future Enhancements

- [ ] Real AI integration (OpenAI API)
- [ ] Email notifications
- [ ] Mobile app
- [ ] Social features
- [ ] Advanced analytics
- [ ] Goal templates
- [ ] Integration with learning platforms

## 📞 Support

For support or questions, please open an issue in the repository.

---

**Built with ❤️ for the Experiment Labs internship assignment**

