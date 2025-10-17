# Person Manager Frontend

A modern, responsive frontend application for managing personal contacts built with SvelteKit.

## Overview

This SvelteKit application provides a clean, intuitive interface for managing personal contacts with full CRUD operations. It features a responsive design built with Tailwind CSS and includes real-time search functionality.

## Features

### Core Functionality
- **Create Persons**: Add new contacts with comprehensive information
- **View Persons**: Browse all contacts in a clean card-based layout
- **Update Persons**: Edit existing contact information
- **Delete Persons**: Remove contacts with confirmation dialogs
- **Search**: Real-time search across all person fields (name, email, phone, location)

### User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Toast Notifications**: Real-time feedback for all user actions
- **Loading States**: Visual indicators during API operations
- **Error Handling**: Graceful error messages and retry options
- **Form Validation**: Client-side validation with helpful error messages

### Interface Features
- **Inline Form**: Quick person creation without page navigation
- **Full Form Page**: Detailed form for comprehensive data entry
- **Search Filtering**: Instant results as you type
- **Clean Cards**: Well-organized contact display with action buttons

## Technology Stack

- **Framework**: SvelteKit 2.0+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Svelte stores
- **Build Tool**: Vite
- **Package Manager**: npm

## Project Structure

```
src/
├── routes/                    # SvelteKit file-based routing
│   ├── +page.svelte          # Home page with person list
│   └── person/               # Person-related routes
│       ├── new/              # Create new person
│       └── [id]/             # Person detail and edit
├── lib/                      # Shared utilities and components
│   ├── api/                  # API client layer
│   │   └── person.ts         # Person API methods
│   ├── components/           # Reusable UI components
│   │   ├── PersonCard.svelte # Contact display card
│   │   └── PersonForm.svelte # Contact form component
│   └── stores/               # Svelte stores
│       └── toast.ts          # Toast notification store
├── app.html                  # HTML template
└── app.css                   # Global styles
```

## API Integration

The frontend communicates with a Node.js backend through a clean API layer:

- **Base URL**: `http://localthost:3000/api`
- **Endpoints**: RESTful API for person management
- **Error Handling**: Comprehensive error handling with user-friendly messages

### API Methods
```typescript
PersonAPI.getAll()           // Fetch all persons
PersonAPI.getById(id)        // Fetch person by ID
PersonAPI.create(data)       // Create new person
PersonAPI.update(id, data)   // Update person
PersonAPI.delete(id)         // Delete person
```

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open application**:
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run TypeScript checks
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Data Model

### Person Interface
```typescript
interface Person {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}
```

## Components

### PersonCard
Displays person information in a clean card format with action buttons for edit and delete operations.

### PersonForm
Reusable form component for creating and editing persons with validation and error handling.

### Toast System
Global notification system for user feedback using Svelte stores.

## Styling

- **Design System**: Consistent spacing, colors, and typography
- **Responsive**: Mobile-first approach with breakpoints
- **Accessibility**: ARIA labels and keyboard navigation support
- **Dark Mode Ready**: Structured for easy dark mode implementation

## Deployment

The application is configured for deployment on Vercel with automatic builds from the main branch.

### Build Configuration
- **Adapter**: `@sveltejs/adapter-auto` for Vercel deployment
- **Static Assets**: Optimized for CDN delivery
- **Environment Variables**: Production API URL configuration

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement for older browsers

---

Built with ❤️ using SvelteKit and modern web technologies.