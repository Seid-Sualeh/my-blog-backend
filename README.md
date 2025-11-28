# Blog Backend API

A production-ready RESTful API for a modern blog application, built with Express.js and MongoDB. This API provides comprehensive blog management, user authentication, commenting system, and social features with enterprise-level security and performance optimizations.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18+-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-brightgreen.svg)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-orange.svg)](https://jwt.io/)
[![Security](https://img.shields.io/badge/Security-Helmet--Rate--Limiting-red.svg)](#security)

## 🚀 Features

### Core Functionality
- **📝 Blog Management**: Full CRUD operations with publishing workflow
- **👥 User Authentication**: JWT-based auth with registration and login
- **💬 Comment System**: Nested comments with likes and moderation
- **❤️ Social Features**: Like and favorite blogs functionality
- **🔍 Search & Filter**: Advanced search with tags and pagination
- **📊 Writer Profiles**: Complete writer management with statistics

### Security & Performance
- **🔐 JWT Authentication**: Secure token-based authentication
- **🛡️ Rate Limiting**: Configurable rate limits for API protection
- **🧹 Input Sanitization**: XSS and NoSQL injection protection
- **✅ Input Validation**: Comprehensive request validation
- **🔒 Security Headers**: Helmet.js security headers
- **🌐 CORS Configuration**: Proper cross-origin resource sharing
- **⚡ Performance Optimized**: Database indexing and query optimization

### API Excellence
- **📖 RESTful Design**: Clean, consistent API architecture
- **📄 Comprehensive Documentation**: Detailed API documentation
- **🔄 Error Handling**: Consistent error responses
- **📊 Monitoring**: Request logging and health checks
- **🔧 Environment Config**: Flexible environment configuration

## 📋 Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Security Features](#security-features)
- [Database Schema](#database-schema)
- [Development](#development)
- [Production Deployment](#production-deployment)
- [Contributing](#contributing)
- [License](#license)

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- MongoDB 5.0+
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Seid-Sualeh/my-blog-backend.git
   cd my-blog-backend/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   
4. **Configure environment variables**
   ```bash
   # Edit .env file with your configuration
   nano .env
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## ⚡ Quick Start

### Development Mode
```bash
npm run dev    # Starts server with nodemon
```

### Production Mode
```bash
npm start      # Starts production server
```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new writer | ❌ |
| POST | `/api/auth/login` | Login writer | ❌ |
| POST | `/api/auth/logout` | Logout writer | ✅ |
| GET | `/api/auth/refresh-token` | Refresh JWT token | ✅ |
| GET | `/api/auth/writer/:writerId` | Get writer info | ❌ |

### Blog Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/blog` | Get all blogs (paginated) | ❌ |
| GET | `/api/blog/:id` | Get single blog | ❌ |
| POST | `/api/blog` | Create new blog | ✅ |
| PUT | `/api/blog/:id` | Update blog | ✅ |
| DELETE | `/api/blog/:id` | Delete blog | ✅ |
| PATCH | `/api/blog/:id/publish` | Toggle publish status | ✅ |
| POST | `/api/blog/:id/like` | Like/unlike blog | ✅ |
| POST | `/api/blog/:id/favorite` | Add/remove from favorites | ✅ |
| GET | `/api/blog/favorites/me` | Get user's favorite blogs | ✅ |
| GET | `/api/blog/likes/me` | Get user's liked blogs | ✅ |
| GET | `/api/blog/writer/:writerId` | Get blogs by writer | ❌ |

### Comment Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/comments/blog/:blogId` | Get comments for blog | ❌ |
| POST | `/api/comments` | Create comment | ✅ |
| PUT | `/api/comments/:id` | Update comment | ✅ |
| DELETE | `/api/comments/:id` | Delete comment | ✅ |
| POST | `/api/comments/:id/like` | Like/unlike comment | ✅ |
| GET | `/api/comments/writer/:writerId` | Get comments by author | ❌ |

### Writer Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/writer` | Get all writers (paginated) | ❌ |
| GET | `/api/writer/:id` | Get single writer | ❌ |
| POST | `/api/writer` | Create writer | ✅ |
| PUT | `/api/writer/:id` | Update writer | ✅ |
| DELETE | `/api/writer/:id` | Delete writer | ✅ |
| GET | `/api/writer/:id/stats` | Get writer statistics | ❌ |
| PATCH | `/api/writer/:id/deactivate` | Deactivate writer | ✅ |

## 🔧 Environment Variables

### Required Variables

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Server Configuration
PORT=5000
NODE_ENV=development

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Frontend Configuration
FRONTEND_URL=http://localhost:3000

# Rate Limiting (optional)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Variable Descriptions

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | Required |
| `PORT` | Server port number | 5000 |
| `NODE_ENV` | Environment mode | development |
| `JWT_SECRET` | Secret key for JWT signing | Required |
| `FRONTEND_URL` | Frontend URL for CORS | localhost:3000 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit time window (ms) | 900000 |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |

## 🛡️ Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication with 7-day expiration
- **Password Security**: Bcrypt hashing with salt rounds
- **Protected Routes**: Middleware-based route protection
- **Token Refresh**: Automatic token refresh mechanism

### API Protection
- **Rate Limiting**: 
  - General API: 100 requests per 15 minutes
  - Authentication: 5 requests per 15 minutes
  - Password reset: 3 attempts per hour
- **Input Sanitization**: Protection against NoSQL injection attacks
- **XSS Prevention**: Content filtering and HTML tag removal
- **CORS Protection**: Configurable cross-origin policies

### Security Headers
- Content Security Policy (CSP)
- X-Frame-Options (Clickjacking protection)
- X-Content-Type-Options (MIME sniffing protection)
- X-XSS-Protection (XSS filter)
- Strict-Transport-Security (HTTPS enforcement)

## 🗄️ Database Schema

### Writer Model
```javascript
{
  name: String,           // Required, 2-100 chars
  email: String,          // Required, unique, valid email
  password: String,       // Required, 6+ chars, hashed
  bio: String,            // Optional, max 500 chars
  profileImage: String,   // Optional, URL
  socialLinks: {          // Optional social media links
    website: String,
    twitter: String,
    linkedin: String
  },
  isActive: Boolean,      // Account status
  createdAt: Date,
  updatedAt: Date
}
```

### Blog Model
```javascript
{
  title: String,          // Required, 5-200 chars
  content: String,        // Required, 50+ chars
  excerpt: String,        // Optional, max 300 chars
  coverImage: String,     // Optional, URL
  tags: [String],         // Optional array of tags
  isPublished: Boolean,   // Publish status
  publishedAt: Date,      // Auto-set on publish
  writer: ObjectId,       // Required, references Writer
  likes: [ObjectId],      // Array of Writer IDs who liked
  favorites: [ObjectId],  // Array of Writer IDs who favorited
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Model
```javascript
{
  content: String,        // Required, 1-1000 chars
  author: ObjectId,       // Required, references Writer
  blog: ObjectId,         // Required, references Blog
  parentComment: ObjectId, // Optional, for nested comments
  isApproved: Boolean,    // Moderation status
  likes: [ObjectId],      // Array of Writer IDs who liked
  replyCount: Number,     // Auto-calculated reply count
  createdAt: Date,
  updatedAt: Date
}
```

## 🔨 Development

### Available Scripts

```bash
npm run dev       # Development with nodemon
npm start         # Production mode
npm test          # Run tests (if configured)
```

### Project Structure

```
server/
├── src/
│   ├── app.js              # Express app configuration
│   ├── config/             # Database and app configuration
│   │   ├── db.js          # MongoDB connection
│   │   └── index.js       # Environment configuration
│   ├── domains/           # Business logic modules
│   │   ├── auth/          # Authentication module
│   │   ├── blog/          # Blog management module
│   │   ├── comment/       # Comment system module
│   │   ├── writer/        # Writer management module
│   │   └── index.js       # Domain exports
│   ├── middlewares/       # Express middlewares
│   │   ├── auth.js        # Authentication middleware
│   │   ├── rateLimit.js   # Rate limiting middleware
│   │   ├── security.js    # Security middleware
│   │   ├── validation.js  # Input validation middleware
│   │   └── errorHandler.js # Global error handler
│   └── routes/            # API route definitions
│       ├── auth.routes.js
│       ├── blog.routes.js
│       ├── comment.routes.js
│       ├── writer.routes.js
│       └── index.js       # Route configuration
├── .env                   # Environment variables
├── .env.example          # Environment template
├── package.json          # Project dependencies
├── API_DOCUMENTATION.md  # Detailed API docs
└── README.md            # This file
```

### Adding New Features

1. **Create Domain Module**
   ```bash
   # Create new domain directory
   mkdir src/domains/feature-name
   ```

2. **Implement Model-Service-Controller Pattern**
   - `feature.model.js` - Mongoose model
   - `feature.service.js` - Business logic
   - `feature.controller.js` - Route handlers

3. **Add Routes**
   - Update `src/routes/index.js` with new routes
   - Create route file in `src/routes/`

4. **Add Middleware**
   - Authentication/authorization as needed
   - Input validation
   - Rate limiting

### Testing

The API is ready for testing with:
- **Postman/Insomnia**: Import the API documentation
- **Thunder Client**: VS Code extension
- **HTTPie**: Command-line testing
- **Jest/Supertest**: Unit and integration testing (can be added)

Example request:
```bash
# Register a new writer
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

## 🚀 Production Deployment

### Environment Setup
1. **Production Environment Variables**
   ```env
   NODE_ENV=production
   MONGO_URI=mongodb+srv://user:pass@prod-cluster.mongodb.net/blog
   JWT_SECRET=very-secure-production-secret
   FRONTEND_URL=https://yourdomain.com
   ```

2. **Database Optimization**
   - Use MongoDB Atlas or managed MongoDB service
   - Configure proper indexing
   - Set up database monitoring

3. **Security Checklist**
   - [ ] Change JWT_SECRET to a strong, unique value
   - [ ] Configure proper CORS origins
   - [ ] Set up SSL/TLS certificates
   - [ ] Enable database authentication
   - [ ] Configure backup strategy
   - [ ] Set up monitoring and logging

### Deployment Platforms

#### Heroku
```bash
# Create Procfile
echo "web: node server.js" > Procfile

# Deploy
git add .
git commit -m "Deploy to production"
git push heroku main
```

#### Railway
```bash
# Connect to Railway
railway login
railway deploy
```

#### DigitalOcean/VPS
```bash
# Install PM2 for process management
npm install -g pm2

# Start with PM2
pm2 start server.js --name "blog-api"
pm2 startup
pm2 save
```

### Performance Optimization
- **Database Indexing**: Ensure proper indexes for frequently queried fields
- **Caching**: Consider Redis for session management and caching
- **Load Balancing**: Use multiple server instances behind a load balancer
- **CDN**: Serve static assets via CDN
- **Monitoring**: Set up application monitoring (New Relic, DataDog, etc.)

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow
1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes**: Follow coding standards
4. **Write tests**: Add tests for new functionality
5. **Test thoroughly**: Ensure all tests pass
6. **Submit a pull request**: Include detailed description

### Code Standards
- **ESLint**: Follow the project's ESLint configuration
- **Prettier**: Code formatting (if configured)
- **Documentation**: Update documentation for new features
- **Security**: Follow security best practices
- **Testing**: Write tests for critical functionality

### Pull Request Guidelines
- **Clear title and description**
- **Reference issues**: Link related issues
- **Screenshots**: Include screenshots for UI changes
- **Breaking changes**: Document any breaking changes
- **Tests**: Include tests for new functionality

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Documentation**: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Issues**: Create an issue on GitHub
- **Security**: Report security issues privately

---

**Built with ❤️ using Node.js, Express.js, and MongoDB**
