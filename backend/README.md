# Task Management App - Backend

A modular Node.js API and MongoDB for user authentication and task management.

## Features

- User authentication (signup/signin)
- Task CRUD operations
- MongoDB integration
- Modular architecture
- CORS enabled
- Vercel deployment ready

## Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment:**
```bash
# Create .env file
MONGODB_URI=mongodb://localhost:27017/taskapp
PORT=3000
NODE_ENV=development
```

3. **Run the server:**
```bash
npm run dev
# Server runs on http://localhost:3000
```

## API Endpoints

### Authentication
- `POST /signup` - Create new user
- `POST /signin` - User login

### Users
- `GET /users` - Get all users
- `GET /` - Welcome page
- `GET /home` - Home page

### Tasks
- `POST /tasks` - Create task
- `GET /tasks` - Get all tasks
- `GET /tasks/:id` - Get specific task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `GET /tasks/stats/:userId` - User task stats

### Utility
- `GET /health` - Health check

## Project Structure

```
├── config/
│   └── database.js         # MongoDB connection
├── controllers/
│   ├── taskController.js   # Task business logic
│   └── userController.js   # User business logic
├── middleware/
│   └── cors.js            # CORS configuration
├── models/
│   └── User.js            # User schema
├── routes/
│   ├── taskRoutes.js      # Task endpoints
│   └── userRoutes.js      # User endpoints
├── utils/
│   └── logger.js          # Logging utilities
├── server.js              # Main server file
└── vercel.json           # Vercel config
```

## Database Setup

**MongoDB Atlas (Recommended):**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create cluster and get connection string
3. Update `MONGODB_URI` in `.env`

**Local MongoDB:**
```bash
# Using Docker
docker run -d -p 27017:27017 mongo:latest
```

## Deployment (Vercel)

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Set environment variables:**
   - `MONGODB_URI`
   - `NODE_ENV=production`
4. **Deploy!**

## Testing

```bash
# Health check
curl http://localhost:3000/health

# Create user
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"123456"}'

# Sign in
curl -X POST http://localhost:3000/signin \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"123456"}'
```



**Backend for the 3-hour task management project.**