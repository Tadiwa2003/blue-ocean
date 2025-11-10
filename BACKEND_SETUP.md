# Backend Setup Guide - Blue Ocean Marketplace

## ✅ Backend Implementation Complete

A full Express.js backend server has been implemented for the Blue Ocean marketplace application.

## 🏗️ Architecture

### Backend Structure
```
server/
├── index.js                 # Main server file
├── routes/                  # API route handlers
│   ├── auth.js             # Authentication routes
│   ├── users.js             # User management routes
│   ├── orders.js            # Order management routes
│   ├── contact.js           # Contact form routes
│   └── products.js          # Product routes
├── controllers/             # Business logic
│   ├── authController.js
│   ├── userController.js
│   ├── orderController.js
│   ├── contactController.js
│   └── productController.js
├── middleware/              # Custom middleware
│   ├── auth.js             # JWT authentication
│   └── validation.js       # Input validation
└── data/                    # Data persistence (JSON files)
    ├── users.json          # User data
    ├── orders.json         # Order data
    └── contact.json        # Contact messages
```

## 🚀 Getting Started

### 1. Start the Backend Server

```bash
# Start backend server only
npm run server

# Start backend with auto-reload (development)
npm run dev:server

# Start both frontend and backend together
npm run dev:all
```

### 2. Environment Variables

The server uses environment variables from `.env`:
- `PORT` - Server port (default: 3001)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)

## 📡 API Endpoints

### Authentication (`/api/auth`)

- **POST** `/api/auth/signup` - Create new user account
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }
  ```

- **POST** `/api/auth/signin` - Sign in user
  ```json
  {
    "email": "john@example.com",
    "password": "SecurePass123"
  }
  ```

- **POST** `/api/auth/signout` - Sign out user (requires auth token)
- **GET** `/api/auth/me` - Get current user (requires auth token)
- **POST** `/api/auth/password-reset` - Request password reset

### Users (`/api/users`)

- **GET** `/api/users/profile` - Get user profile (requires auth token)
- **PATCH** `/api/users/profile` - Update user profile (requires auth token)

### Orders (`/api/orders`)

- **POST** `/api/orders` - Create new order (requires auth token)
  ```json
  {
    "items": [...],
    "shippingInfo": {...},
    "total": 150.00
  }
  ```

- **GET** `/api/orders` - Get user's orders (requires auth token)
- **GET** `/api/orders/:id` - Get order by ID (requires auth token)
- **PATCH** `/api/orders/:id/status` - Update order status (admin/owner only)

### Contact (`/api/contact`)

- **POST** `/api/contact` - Submit contact message (public)
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "company": "Company Name",
    "message": "Message content"
  }
  ```

- **GET** `/api/contact` - Get all contact messages (admin/owner only)

### Products (`/api/products`)

- **GET** `/api/products` - Get all products (public)
- **GET** `/api/products/:id` - Get product by ID (public)

## 🔐 Authentication

The backend uses JWT (JSON Web Tokens) for authentication:

1. User signs up or signs in
2. Server returns a JWT token
3. Client stores token in localStorage
4. Client includes token in `Authorization: Bearer <token>` header for protected routes

### Default Users

The system initializes with these default users:

- **Owner:** founder@blueocean.co / blueocean2024
- **Admin:** admin@blueocean.co / admin123
- **User:** user@blueocean.co / user123

## 🔧 Frontend Integration

### API Service (`src/services/api.js`)

The frontend uses a centralized API service:

```javascript
import api from './services/api.js';

// Sign up
const response = await api.auth.signUp({ name, email, password });

// Sign in
const response = await api.auth.signIn(email, password);

// Create order
const response = await api.orders.createOrder({ items, shippingInfo, total });

// Send contact message
const response = await api.contact.sendMessage({ name, email, message });
```

### Environment Variables

Add to `.env`:
```
VITE_API_URL=http://localhost:3001/api
```

## 📦 Data Storage

Currently, data is stored in JSON files:
- `server/data/users.json` - User accounts
- `server/data/orders.json` - Orders
- `server/data/contact.json` - Contact messages

**Note:** For production, consider migrating to a database (MongoDB, PostgreSQL, etc.)

## 🛡️ Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Input validation
- ✅ CORS configuration
- ✅ Role-based access control (RBAC)
- ✅ Password strength requirements

## 🧪 Testing

### Health Check
```bash
curl http://localhost:3001/api/health
```

### Sign Up
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test123"}'
```

### Sign In
```bash
curl -X POST http://localhost:3001/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"founder@blueocean.co","password":"blueocean2024"}'
```

## 📝 Notes

- The backend runs on port 3001 by default
- Frontend runs on port 5173 (Vite default)
- CORS is configured to allow requests from the frontend URL
- JWT tokens expire after 7 days
- All passwords are hashed using bcrypt with 10 salt rounds

## 🚀 Production Considerations

1. **Database:** Replace JSON files with a proper database
2. **Environment Variables:** Use secure environment variable management
3. **HTTPS:** Use HTTPS in production
4. **Rate Limiting:** Add rate limiting to prevent abuse
5. **Logging:** Implement proper logging (Winston, Morgan)
6. **Error Handling:** Enhance error handling and monitoring
7. **Email Service:** Integrate email service for password resets
8. **File Uploads:** Add file upload handling if needed

---

**Status:** ✅ Backend is fully functional and ready for use!

