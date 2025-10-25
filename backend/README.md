# Finance Minister Backend API

A comprehensive Node.js Express API for the Finance Minister application with user authentication, authorization, and security features.

## Features

- **User Management**: Complete CRUD operations for users
- **Authentication**: JWT-based authentication with refresh tokens
- **Authorization**: Role-based access control (Admin, Moderator, User)
- **Security**: Rate limiting, input validation, password hashing, CORS protection
- **Validation**: Comprehensive input validation using express-validator
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Database**: MongoDB with Mongoose ODM

## API Endpoints

### Authentication Routes

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `POST /api/users/forgot-password` - Request password reset
- `POST /api/users/reset-password` - Reset password with token

### User Routes (Protected)

- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password

### Admin Routes (Admin Only)

- `GET /api/users` - Get all users (paginated)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user by ID
- `DELETE /api/users/:id` - Delete user by ID

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Update `.env` file with your configuration:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/finance-minister
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:4200
```

4. Start the server:

```bash
# Development
npm run dev

# Production
npm start
```

## Environment Variables

| Variable       | Description                               | Default                                    |
| -------------- | ----------------------------------------- | ------------------------------------------ |
| `NODE_ENV`     | Environment (development/production/test) | development                                |
| `PORT`         | Server port                               | 3000                                       |
| `MONGODB_URI`  | MongoDB connection string                 | mongodb://localhost:27017/finance-minister |
| `JWT_SECRET`   | JWT secret key                            | your-super-secret-jwt-key                  |
| `JWT_EXPIRE`   | JWT expiration time                       | 7d                                         |
| `FRONTEND_URL` | Frontend URL for CORS                     | http://localhost:4200                      |

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Request rate limiting
- **Input Validation**: Comprehensive input validation
- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Sanitization**: XSS protection
- **MongoDB Injection Protection**: NoSQL injection prevention

## User Schema

```javascript
{
  firstName: String (required, 2-50 chars)
  lastName: String (required, 2-50 chars)
  email: String (required, unique, valid email)
  password: String (required, min 6 chars, hashed)
  role: String (enum: user, admin, moderator, default: user)
  isActive: Boolean (default: true)
  isEmailVerified: Boolean (default: false)
  phoneNumber: String (optional, valid phone format)
  address: Object (optional)
  preferences: Object (optional)
  createdAt: Date
  updatedAt: Date
}
```

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Linting

```bash
# Check for linting errors
npm run lint

# Fix linting errors
npm run lint:fix
```

## API Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors (if any)
  ]
}
```

## Health Check

- `GET /health` - Server health check endpoint

## Rate Limiting

- General API: 100 requests per 15 minutes
- Authentication: 5 requests per 15 minutes
- Password Reset: 3 requests per hour

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run tests and linting
6. Submit a pull request

## License

MIT License
