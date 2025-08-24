# Lead Management System

A full-stack MERN application for managing leads with advanced filtering, pagination, and authentication features.

## 🌐 **Live Demo**
- **Frontend**: https://erino-sde-internship-assignment.vercel.app/
- **Backend API**: https://erino-sde-internship-assignment.onrender.com/
- **Test Account**: testuser@test.com / test1234

## 🚀 Features

- **Complete CRUD Operations**: Create, read, update, and delete leads
- **Advanced Data Grid**: AG Grid with sorting, filtering, and pagination
- **Secure Authentication**: JWT-based auth with httpOnly cookies
- **Server-side Pagination**: Efficient data loading with configurable limits
- **Advanced Filtering**: Multiple filter types with AND logic
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Validation**: Form validation with comprehensive error handling
- **Seeded Data**: 150+ sample leads with realistic data

## 🛠 Tech Stack

### Backend
- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Database and ODM
- **JWT** + **bcryptjs** - Authentication and password hashing
- **CORS** + **cookie-parser** - Security middleware

### Frontend
- **React 18** + **Vite** - Modern React framework
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with cookie support
- **AG Grid React** - Advanced data grid component
- **Context API** - State management

## 📋 Prerequisites

- Node.js 18 or higher
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🚀 Deployment

This application is designed to be deployed on:
- **Backend**: Render (https://render.com)
- **Frontend**: Vercel (https://vercel.com)

### Backend Deployment (Render)

1. **Prepare for Render**:
   - Ensure your backend code is in a GitHub repository
   - Make sure the `.env` file is configured correctly

2. **Deploy on Render**:
   - Create a new Web Service on Render
   - Connect your GitHub repository
   - Set the build command: `npm install`
   - Set the start command: `npm start`
   - Add environment variables:
     ```
     PORT=5001
     MONGODB_URI=your_mongodb_atlas_connection_string
     JWT_SECRET=your_super_secret_jwt_key_here_change_in_production_at_least_32_characters_long
     NODE_ENV=production
     ```

3. **MongoDB Atlas Setup**:
   - Create a MongoDB Atlas cluster
   - Get your connection string
   - Whitelist Render's IP addresses or use 0.0.0.0/0 for all IPs

### Frontend Deployment (Vercel)

1. **Update API Configuration**:
   ```javascript
   // In src/api.js
   const API_BASE_URL = process.env.NODE_ENV === 'production' 
     ? 'https://your-backend-name.onrender.com/api'  // Your Render backend URL
     : 'http://localhost:5001/api';
   ```

2. **Deploy on Vercel**:
   - Connect your GitHub repository to Vercel
   - Set the framework preset to "Vite"
   - Deploy automatically

## ⚡ Local Development

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd "Lead Management System"
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Update .env with your MongoDB URI and JWT secret

# Start MongoDB (if running locally)
# For Windows: net start MongoDB
# For macOS: brew services start mongodb-community
# For Linux: sudo systemctl start mongod

# Seed the database (optional)
npm run seed

# Start development server
npm run dev
```

The backend will start on `http://localhost:5001`

### 3. Frontend Setup

```bash
# Open new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:3000`

### 4. Access the Application

1. Open your browser and go to `http://localhost:3000`
2. Register a new account or use the test account:
   - Email: `testuser@test.com`
   - Password: `test1234`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Leads (Protected)
- `GET /api/leads` - List leads with pagination and filters
- `POST /api/leads` - Create new lead
- `GET /api/leads/:id` - Get single lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead

### Health Check
- `GET /health` - API health status

## 🔍 Advanced Filtering

The API supports advanced filtering on leads:

```javascript
// Example filter query
{
  "email": {
    "operator": "contains",
    "value": "john"
  },
  "status": {
    "operator": "equals",
    "value": "New"
  },
  "createdAt": {
    "operator": "between",
    "value": ["2024-01-01", "2024-12-31"]
  }
}
```

**Supported Operators**:
- `equals` - Exact match
- `contains` - Partial text match (case-insensitive)
- `startsWith` - Text starts with value
- `endsWith` - Text ends with value
- `greaterThan` - Numeric/date comparison
- `lessThan` - Numeric/date comparison
- `between` - Range comparison (requires array with 2 values)

## 📄 Project Structure

```
Lead Management System/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema
│   │   └── Lead.js          # Lead schema
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   └── leads.js         # Lead CRUD routes
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── utils/
│   │   └── seedData.js      # Database seeding utility
│   ├── server.js            # Express server setup
│   ├── .env                 # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── LeadsList.jsx
│   │   │   ├── LeadForm.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── Loading.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── api.js           # API configuration
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # React entry point
│   ├── index.html
│   └── package.json
└── README.md
```

## 🔐 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Tokens**: Stored in httpOnly cookies
- **CORS Protection**: Configured for frontend origins
- **Input Validation**: Mongoose schema validation
- **Route Protection**: Private routes require authentication

## 🧪 Sample Data

The application includes a seeding script that creates:
- A test user account (testuser@test.com / test1234)
- 150+ sample leads with realistic data including:
  - Names, emails, phone numbers
  - Company information
  - Various lead statuses (New, Contacted, Qualified, Lost)
  - Random creation dates

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Ensure MongoDB is running
   - Check the MONGODB_URI in .env
   - Verify database permissions

2. **CORS Errors**:
   - Check if frontend URL is in backend CORS origins
   - Ensure credentials are included in requests

3. **Authentication Issues**:
   - Verify JWT_SECRET is set
   - Check if cookies are enabled in browser
   - Ensure backend and frontend are on correct ports

4. **Port Conflicts**:
   - Default ports: Backend (5001), Frontend (3000)
   - Change ports in .env and package.json if needed

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
# Navigate to backend
cd backend

# Install dependencies
npm install

# Configure environment variables
# Copy .env and update with your MongoDB URI
cp .env .env.local

# Seed the database with sample data
npm run seed

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

### 4. Test the Application

Use the test account created during seeding:
- **Email**: `testuser@test.com`
- **Password**: `test1234`

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lead_management
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
NODE_ENV=development
```

### Frontend API Configuration

Update `frontend/src/api.js` for your backend URL:

```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-domain.onrender.com'
  : 'http://localhost:5000';
```

## 📊 Database Schema

### User Model
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  createdAt: Date,
  updatedAt: Date
}
```

### Lead Model
```javascript
{
  first_name: String (required),
  last_name: String (required),
  email: String (unique, required),
  phone: String,
  company: String,
  city: String,
  state: String,
  source: Enum ['website', 'facebook_ads', 'google_ads', 'referral', 'events', 'other'],
  status: Enum ['new', 'contacted', 'qualified', 'lost', 'won'],
  score: Number (0-100),
  lead_value: Number,
  last_activity_at: Date,
  is_qualified: Boolean,
  created_at: Date,
  updated_at: Date
}
```

## 🔐 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user (sets httpOnly cookie)
- `POST /auth/logout` - Logout user (clears cookie)
- `GET /auth/me` - Get current user info

### Leads (Protected)
- `GET /leads` - List leads with pagination & filters
- `POST /leads` - Create new lead
- `GET /leads/:id` - Get single lead
- `PUT /leads/:id` - Update lead
- `DELETE /leads/:id` - Delete lead

### Health Check
- `GET /health` - API status

## 🔍 Advanced Filtering

The system supports comprehensive filtering with multiple operators:

### String Fields (email, company, city)
- `equals` - Exact match
- `contains` - Partial match (case-insensitive)

### Enum Fields (status, source)
- `equals` - Single value match
- `in` - Multiple values match

### Number Fields (score, lead_value)
- `equals` - Exact value
- `gt` - Greater than
- `lt` - Less than
- `between` - Range (min/max)

### Date Fields (created_at, last_activity_at)
- `on` - Specific date
- `before` - Before date
- `after` - After date
- `between` - Date range

### Boolean Fields (is_qualified)
- `equals` - True/false

### Example Filter Query
```javascript
{
  "status": {
    "operator": "in",
    "value": ["new", "contacted"]
  },
  "score": {
    "operator": "between",
    "value": { "min": 50, "max": 100 }
  },
  "email": {
    "operator": "contains",
    "value": "gmail"
  }
}
```

## 📄 Pagination

Server-side pagination with configurable limits:

```javascript
// Request
GET /leads?page=1&limit=20&filters={...}

// Response
{
  "success": true,
  "data": [...],
  "page": 1,
  "limit": 20,
  "total": 146,
  "totalPages": 8
}
```

## 🚀 Deployment

### Backend Deployment (Render)

1. **Prepare for production**:
   - Update MongoDB URI to MongoDB Atlas
   - Set secure JWT secret
   - Update CORS origins

2. **Deploy to Render**:
   - Connect GitHub repository
   - Set environment variables
   - Deploy with auto-build

3. **Seed production database**:
   ```bash
   npm run seed
   ```

### Frontend Deployment (Vercel)

1. **Update API URL**:
   ```javascript
   const API_BASE_URL = 'https://your-backend.onrender.com';
   ```

2. **Deploy to Vercel**:
   - Connect GitHub repository
   - Auto-deploy with Vite preset

## 🧪 Testing

### Manual Testing Checklist

#### Authentication
- [ ] User registration works
- [ ] User login works
- [ ] Logout clears session
- [ ] Protected routes redirect to login
- [ ] Invalid credentials show error

#### Lead Management
- [ ] View leads list with pagination
- [ ] Create new lead
- [ ] Edit existing lead
- [ ] Delete lead with confirmation
- [ ] Search and filter leads
- [ ] Sort by different columns

#### Data Validation
- [ ] Required fields validated
- [ ] Email format validated
- [ ] Numeric fields accept only numbers
- [ ] Enum fields restricted to valid values

### Test Data

After seeding, you'll have:
- 1 test user account
- 150+ sample leads with realistic data
- Various lead statuses and sources
- Different score ranges and lead values

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: httpOnly cookies (not localStorage)
- **CORS Protection**: Configured for specific origins
- **Input Validation**: Mongoose schema validation
- **NoSQL Injection Protection**: Mongoose ODM
- **Secure Cookies**: Secure flag for HTTPS

## 📱 Responsive Design

The application is fully responsive and optimized for:

- **Desktop**: Full-featured data grid with all columns
- **Tablet**: Horizontal scrolling with touch navigation
- **Mobile**: Stacked forms and touch-friendly buttons

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Check MongoDB is running
   - Verify connection string in .env

2. **CORS Error**:
   - Update allowed origins in backend
   - Check credentials configuration

3. **Authentication Issues**:
   - Clear browser cookies
   - Check JWT secret consistency
   - Verify httpOnly cookie settings

4. **Build Errors**:
   - Check Node.js version (18+)
   - Clear node_modules and reinstall
   - Verify all dependencies installed

### Development Tips

- Use browser DevTools to debug
- Check Network tab for API calls
- Inspect cookies in Application tab
- Use MongoDB Compass for database inspection

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **AG Grid** for the excellent data grid component
- **Faker.js** for realistic test data generation
- **MongoDB** team for the excellent database
- **React** team for the amazing framework
