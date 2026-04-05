🔬 LabBook — Cloud-Based Lab Booking System
A full-stack, production-ready lab booking system built with the MERN stack (MongoDB, Express.js, React.js, Node.js). Students can book lab time slots, view availability in real-time, and manage their bookings — all with instant confirmation.

MERN Stack License

✨ Features
JWT Authentication — Secure email/password login and registration
Real-time Slot Availability — See which slots are available for any date
Instant Booking — Book a lab slot, auto-confirmed immediately
Double-Booking Prevention — Database-level compound index + application logic
Interactive Calendar — Click any date to see available time slots
Booking Management — View, filter, and cancel your upcoming bookings
Responsive Design — Beautiful on desktop, tablet, and mobile
Glassmorphism UI — Modern dark theme with frosted-glass panels
Toast Notifications — Success/error feedback on every action
Loading & Empty States — Skeleton loaders and helpful empty messages


🏗️ Tech Stack(MERN Stack)
Layer	Technology
Frontend	React 19, React Router, Axios, Tailwind CSS v4
Backend	Node.js, Express.js, Express Validator
Database	MongoDB (Atlas ready) with Mongoose
Auth	JWT (jsonwebtoken) + bcryptjs
Build Tool	Vite
Icons	React Icons (Heroicons)
Toasts	React Hot Toast
📁 Project Structure
lab-booking-system/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── BookingSuccessModal.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/           # React context providers
│   │   │   └── AuthContext.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── BookLab.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── MyBookings.jsx
│   │   ├── services/          # API service layer
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                    # Express backend
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   └── bookingController.js
│   ├── middleware/
│   │   ├── auth.js            # JWT auth middleware
│   │   └── errorHandler.js    # Global error handler
│   ├── models/
│   │   ├── User.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── bookingRoutes.js
│   ├── server.js
│   ├── seed.js
│   └── package.json
│
└── README.md
🚀 Getting Started
Prerequisites
Node.js v18+ installed
MongoDB Atlas account (or local MongoDB)
npm or yarn
1. Clone the Repository
git clone https://github.com/yourusername/lab-booking-system.git
cd lab-booking-system
2. Set Up the Backend
cd server
npm install
Create a .env file in the server/ directory:

PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/lab-booking?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this
CLIENT_URL=http://localhost:5173
Seed the database with sample data (optional):

npm run seed
Start the backend:

npm run dev
The API will run on http://localhost:5000.

3. Set Up the Frontend
Open a new terminal:

cd client
npm install
For local development with the Vite proxy (recommended), no .env changes needed. The proxy in vite.config.js forwards /api requests to localhost:5000.

Start the frontend:

npm run dev
The app will run on http://localhost:5173.

4. Test Credentials (after seeding)
Email	Password
alice@example.com	password123
bob@example.com	password123
charlie@example.com	password123


📡 API Endpoints
Auth
Method	Endpoint	Description	Auth
POST	/api/auth/register	Register user	❌
POST	/api/auth/login	Login user	❌
GET	/api/auth/me	Get profile	✅
Bookings
Method	Endpoint	Description	Auth
GET	/api/bookings/timeslots	List all time slots	❌
GET	/api/bookings/slots/:date	Available slots by date	✅
POST	/api/bookings	Create a booking	✅
GET	/api/bookings/my	Get user's bookings	✅
DELETE	/api/bookings/:id	Cancel a booking	✅


☁️ Deployment
Backend → Render
Push the server/ folder to a GitHub repo
Create a Web Service on Render
Set the root directory to server
Set build command: npm install
Set start command: npm start
Add environment variables:
MONGODB_URI
JWT_SECRET
CLIENT_URL (your Vercel URL)
Frontend → Vercel
Push the client/ folder to a GitHub repo
Import on Vercel
Set the root directory to client
Add environment variable:
VITE_API_URL = your Render backend URL (e.g., https://your-app.onrender.com)
Deploy!


🔒 Security Features
bcryptjs password hashing (12 salt rounds)
JWT token-based authentication (7-day expiry)
Express Validator input validation
Compound unique index on {date, timeSlot} to prevent double booking at the DB level
CORS configured for specific origins only
Protected routes on both frontend and backend


📋 Available Time Slots
Slot
08:00 - 09:00
09:00 - 10:00
10:00 - 11:00
11:00 - 12:00
12:00 - 1:00
1:00 - 2:00
2:00 - 3:00
3:00 - 4:00
4:00 - 4:00
5:00 - 6:00


📄 License
MIT License — free for personal and commercial use.
