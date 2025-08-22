# Node.js MongoDB App

A basic Node.js application with Express.js and MongoDB, ready for deployment on Vercel.

## Features

- Express.js server with 2 main routes (`/` and `/home`)
- MongoDB integration with Mongoose
- Vercel deployment configuration
- Environment variable support
- Health check endpoint

## Routes

- `GET /` - Welcome page with database status and user count
- `GET /home` - Home page with recent users and app features
- `POST /users` - Create a new user (for testing)
- `GET /health` - Health check endpoint

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Set up MongoDB

**Option A: MongoDB Atlas (Cloud - Recommended for Vercel)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Replace `<username>`, `<password>`, and `<cluster-url>` in your connection string

**Option B: Local MongoDB**
```bash
# Install MongoDB locally or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 3. Environment Variables

Create a `.env` file in your project root:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name
PORT=3000
NODE_ENV=development
```

### 4. Run Locally

```bash
# Development mode with nodemon
npm run dev

# Or regular start
npm start
```

Visit `http://localhost:3000` to see your app running.

## Deployment on Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

### 2. Deploy to Vercel

**Option A: Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Connect your GitHub account
3. Import your repository
4. Add environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NODE_ENV`: `production`
5. Deploy!

**Option B: Vercel CLI**
```bash
npm i -g vercel
vercel login
vercel
```

### 3. Set Environment Variables in Vercel

In your Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NODE_ENV`: `production`

## Testing Your API

```bash
# Test the main routes
curl https://your-vercel-app.vercel.app/
curl https://your-vercel-app.vercel.app/home

# Test creating a user
curl -X POST https://your-vercel-app.vercel.app/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'

# Health check
curl https://your-vercel-app.vercel.app/health
```

## Project Structure

```
├── server.js          # Main application file
├── package.json       # Dependencies and scripts
├── vercel.json        # Vercel configuration
├── .env.example       # Environment variables template
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## Important Notes

- MongoDB Atlas is recommended for production deployment
- Make sure to whitelist Vercel's IP addresses in MongoDB Atlas (or use 0.0.0.0/0 for all IPs)
- Environment variables must be set in Vercel dashboard for production
- The app exports itself for Vercel serverless functions

## Troubleshooting

1. **MongoDB Connection Issues**: Check your connection string and network access in MongoDB Atlas
2. **Vercel Build Fails**: Ensure all dependencies are in `package.json` and not `devDependencies`
3. **Environment Variables**: Make sure they're set in both `.env` (local) and Vercel dashboard (production)