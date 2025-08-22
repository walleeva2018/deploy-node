# Task Management App - Frontend

A simple task management web app built with **Next.js** in **3 hours**. This is just the frontend - you need to run the backend server separately.

## What it does

- Sign up / Sign in with username and password
- Create, edit, and delete tasks
- Mark tasks as complete
- Clean, responsive interface

## Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Start the development server:**
```bash
npm run dev
```

3. **Open [http://localhost:3001](http://localhost:3001)**

## Important Notes

- **Frontend only** - Make sure your backend API is running on `http://localhost:3000`
- **API Base URL** - Update the API_BASE_URL in components if your backend runs elsewhere
- **No database** - This connects to your separate Express.js backend

## Project Structure

```
app/
├── components/
│   ├── tasks/
│   │   └── AuthTabs.tsx
│   ├── SignIn.tsx
│   ├── SignUp.tsx
│   └── Welcome.tsx
├── tasks/
│   └── page.tsx
├── layout.tsx
└── page.tsx
```

## Tech Stack

- **Next.js** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Local Storage** - Session management

## Backend Required

This frontend needs the Express.js backend running. The backend handles:
- User authentication
- Task CRUD operations
- MongoDB database

---

**Built in 3 hours as a full-stack learning project.**