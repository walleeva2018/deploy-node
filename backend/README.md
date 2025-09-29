# Person Manager - Backend

A RESTful API built with Node.js, Express, and MongoDB for managing person records with full CRUD operations.

## Features

- Person CRUD operations (Create, Read, Update, Delete)
- MongoDB integration with Mongoose
- CORS enabled for trusted origins
- Centralized error handling
- Request logging using morgan
- Environment-based configuration
- Vercel deployment ready

## Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment:**
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env file with your configuration
MONGODB_URI=mongodb://localhost:27017/person-manager
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

3. **Run the server:**
```bash
npm run dev
# Server runs on http://localhost:3000
```

## API Endpoints

### Persons
- `GET /api/persons` - Get all persons
- `GET /api/persons/:id` - Get single person by ID
- `POST /api/persons` - Create new person
- `PUT /api/persons/:id` - Update person
- `DELETE /api/persons/:id` - Delete person

### Utility
- `GET /health` - Health check

## Person Schema

```json
{
  "firstName": "string (required)",
  "lastName": "string (required)",
  "email": "string (required, unique)",
  "phone": "string (required)",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string",
    "country": "string"
  },
  "createdAt": "date",
  "updatedAt": "date"
}
```

## Project Structure

```
├── config/
│   └── database.js         # MongoDB connection
├── controllers/
│   └── personController.js # Person business logic
├── middleware/
│   ├── cors.js            # CORS configuration
│   └── errorHandler.js    # Centralized error handling
├── models/
│   └── Person.js          # Person schema
├── routes/
│   └── personRoutes.js    # Person endpoints
├── .env.example           # Environment variables template
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
   - `FRONTEND_URL` (your deployed frontend URL)
4. **Deploy!**

## Testing

```bash
# Health check
curl http://localhost:3000/health

# Create person
curl -X POST http://localhost:3000/api/persons \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    }
  }'

# Get all persons
curl http://localhost:3000/api/persons

# Get person by ID
curl http://localhost:3000/api/persons/PERSON_ID

# Update person
curl -X PUT http://localhost:3000/api/persons/PERSON_ID \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@example.com",
    "phone": "+1234567891"
  }'

# Delete person
curl -X DELETE http://localhost:3000/api/persons/PERSON_ID
```

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:3000` (local development)
- `http://localhost:5173` (Vite dev server)
- `http://localhost:4173` (Vite preview)
- Environment variable `FRONTEND_URL`

Update the `FRONTEND_URL` environment variable with your deployed frontend domain for production.

**Backend for the Person Manager SvelteKit Assessment.**