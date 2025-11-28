# Blog Backend API Documentation

A comprehensive RESTful API for a blog application built with Express.js and MongoDB. This API provides authentication, blog management, commenting system, and writer management functionality.

## Features

### ✅ Implemented Features

1. **Authentication & Authorization**
   - JWT-based authentication
   - User registration and login
   - Protected routes with middleware
   - Rate limiting for auth endpoints
   - Token refresh functionality

2. **Blog Management**
   - Create, read, update, delete blogs
   - Publish/unpublish functionality
   - Search and filtering
   - Pagination
   - Tag support
   - Writer association

3. **Writer Management**
   - Writer profiles
   - CRUD operations
   - Statistics and analytics
   - Bio and social links
   - Active/inactive status

4. **Comment System**
   - Nested comments (replies)
   - Comment likes
   - Comment moderation
   - Author attribution
   - Pagination

5. **Security Features**
   - Input sanitization
   - XSS protection
   - Rate limiting
   - CORS configuration
   - Security headers
   - Password hashing with bcrypt

6. **Database**
   - MongoDB with Mongoose
   - Proper indexing
   - Data validation
   - Error handling

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd server
   npm install
   ```
3. Set up environment variables in `.env`:
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=your_frontend_url
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new writer
- `POST /api/auth/login` - Login writer
- `POST /api/auth/logout` - Logout writer
- `GET /api/auth/refresh-token` - Refresh JWT token
- `GET /api/auth/writer/:writerId` - Get writer info

### Blogs
- `GET /api/blog` - Get all blogs (with pagination, filtering)
- `GET /api/blog/:id` - Get single blog
- `POST /api/blog` - Create new blog (protected)
- `PUT /api/blog/:id` - Update blog (protected, owner only)
- `DELETE /api/blog/:id` - Delete blog (protected, owner only)
- `PATCH /api/blog/:id/publish` - Toggle publish status (protected)
- `GET /api/blog/writer/:writerId` - Get blogs by writer

### Writers
- `GET /api/writer` - Get all writers (with pagination)
- `GET /api/writer/:id` - Get single writer
- `POST /api/writer` - Create writer (protected)
- `PUT /api/writer/:id` - Update writer (protected, owner only)
- `DELETE /api/writer/:id` - Delete writer (protected)
- `GET /api/writer/:id/stats` - Get writer statistics
- `PATCH /api/writer/:id/deactivate` - Deactivate writer (protected)

### Comments
- `GET /api/comments/blog/:blogId` - Get comments for a blog
- `GET /api/comments/:id` - Get single comment
- `POST /api/comments` - Create comment (protected)
- `PUT /api/comments/:id` - Update comment (protected, owner only)
- `DELETE /api/comments/:id` - Delete comment (protected, owner only)
- `POST /api/comments/:id/like` - Like/unlike comment (protected)
- `GET /api/comments/writer/:writerId` - Get comments by author

## Request/Response Examples

### Registration
```json
POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response: 201
{
  "success": true,
  "message": "Writer registered successfully",
  "data": {
    "writer": {
      "_id": "64a7...",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200
{
  "success": true,
  "message": "Login successful",
  "data": {
    "writer": { /* writer info */ },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Create Blog
```json
POST /api/blog
Headers: Authorization: Bearer <token>
{
  "title": "My First Blog Post",
  "content": "This is the content of my blog post...",
  "tags": ["technology", "programming"],
  "isPublished": false
}

Response: 201
{
  "success": true,
  "message": "Blog created successfully",
  "data": { /* blog object */ }
}
```

## Middleware

### Authentication Middleware
- `authenticateToken` - Verifies JWT token
- `authorizeOwner` - Ensures user owns the resource
- `optionalAuth` - Optional authentication

### Security Middleware
- `sanitizeQuery/sanitizeBody` - NoSQL injection protection
- `xssProtection` - XSS attack prevention
- Rate limiting with different tiers
- Security headers via Helmet

### Validation Middleware
- Input validation using express-validator
- Custom validation rules for all endpoints
- Comprehensive error responses

## Environment Variables

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Server
PORT=5000
NODE_ENV=development

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# Frontend
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Database Models

### Writer
- Personal information (name, email, password)
- Profile details (bio, profile image, social links)
- Account status (active/inactive)
- Timestamps

### Blog
- Content (title, content, excerpt, cover image)
- Metadata (tags, publish status, published date)
- Writer association
- Timestamps

### Comment
- Content and author
- Blog association
- Nested structure (parent/reply)
- Likes system
- Moderation status

## Security Features

1. **Authentication**
   - JWT tokens with 7-day expiration
   - Password hashing with bcrypt
   - Token refresh mechanism

2. **Rate Limiting**
   - General API limits
   - Stricter limits for authentication
   - Upload limits

3. **Input Validation**
   - Express-validator for all inputs
   - Custom validation rules
   - Sanitization against NoSQL injection

4. **XSS Protection**
   - Content filtering
   - HTML tag removal
   - Output encoding

5. **CORS Configuration**
   - Configurable origins
   - Proper HTTP methods
   - Security headers

## Error Handling

All endpoints return consistent error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation message",
      "value": "invalidValue"
    }
  ]
}
```

## Development

### Running the Server
```bash
npm run dev    # Development with nodemon
npm start      # Production
```

### Testing
The API is ready for testing with tools like:
- Postman
- Insomnia
- Thunder Client (VS Code extension)

## Production Considerations

1. **Environment Variables**: Set secure JWT secrets
2. **Database**: Use MongoDB Atlas or managed service
3. **Rate Limiting**: Adjust limits based on expected traffic
4. **CORS**: Configure proper origins for production
5. **Monitoring**: Add logging and monitoring tools
6. **SSL/TLS**: Use HTTPS in production

## Future Enhancements

### 🔄 In Progress
- Password reset functionality
- Email verification
- Blog like/favorite system
- File upload for images

### 📋 Planned
- API documentation with Swagger
- Admin panel endpoints
- Blog analytics and tracking
- Data seeding scripts
- Search functionality enhancements
- Social media integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details