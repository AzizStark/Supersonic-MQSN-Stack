# HAI - MQSN Stack Application

A full stack poetry application built with the MQSN stack:
- **M**ongoDB: Document database for storing poems
- **Q**uarkus: Fast, lightweight Java backend framework
- **S**olidJS: Reactive frontend JavaScript library
- **N**ode.js: JavaScript runtime for development

## Project Overview

This application is a minimalistic poem displayer with an artisan style aesthetic. It showcases poetry with elegant typography and a clean interface, pulling data from MongoDB through a Quarkus API and displaying it using SolidJS.

## Technology Stack

### Frontend (SolidJS)
- **SolidJS**: Reactive JavaScript library for building user interfaces
- **Vite**: Next generation frontend tooling for fast development
- **CSS**: Custom styling with CSS variables for theming
- **Features**:
  - Reactive data fetching from the backend API
  - Elegant, responsive poem display with proper typography
  - Navigation controls for browsing multiple poems
  - Dark mode support based on system preferences
  - Error handling and loading states
  - Minimalist UI focused on content

### Backend (Quarkus)
- **Quarkus**: Supersonic, subatomic Java framework designed for containers
- **MongoDB Panache**: Simplified MongoDB object-document mapping for Quarkus
- **RESTEasy Reactive**: JAX-RS implementation for building REST APIs
- **Features**:
  - RESTful API endpoints for retrieving poems
  - MongoDB integration using Panache active record pattern
  - CORS configuration for frontend/backend communication
  - Automatic data initialization with sample poems
  - Fast startup and low memory footprint

### Database (MongoDB)
- **MongoDB**: NoSQL document database
- **Collections**: 
  - `poems`: Stores poem documents with title, author, and content
- **Features**:
  - Document-oriented storage ideal for poem content
  - Automatic ID generation
  - Flexible schema for content variations

## Project Structure

- `backend/` - Quarkus Java backend
  - `src/main/java/org/example/` - Java source code
    - `Poem.java` - MongoDB entity model
    - `PoemService.java` - Business logic and data initialization
    - `PoemResource.java` - REST API endpoints
  - `src/main/resources/` - Configuration files
    - `application.properties` - Quarkus and MongoDB settings

- `frontend/` - SolidJS frontend application
  - `src/` - Source code
    - `App.jsx` - Main application component
    - `App.css` - Styling for the poem display
    - `index.css` - Global styles and dark mode support
  - `public/` - Static assets

## Prerequisites

- Java 11 or higher
- Node.js 16 or higher
- MongoDB 4.4 or higher running locally on the default port (27017)

## Setup

1. Ensure MongoDB is running locally on the default port 27017
2. Install all dependencies with a single command:

```bash
npm run install-deps
```

This will install:
- Root level dependencies (concurrently)
- Frontend dependencies

## Running the Application

To run both frontend and backend concurrently:

```bash
npm run dev
```

This command will:
1. Kill any processes running on ports 8081 and 5173/5174
2. Start both the backend and frontend in development mode

### Run Each Service Separately

To run only the backend:

```bash
npm run backend
```

To run only the frontend:

```bash
npm run frontend
```

### Stop Running Services

To stop all running services:

```bash
npm run kill-all
```

To stop only the backend:

```bash
npm run kill-backend
```

To stop only the frontend:

```bash
npm run kill-frontend
```

## Development Access

- Frontend: [http://localhost:5173](http://localhost:5173) or [http://localhost:5174](http://localhost:5174) (if 5173 is already in use)
- Backend API: [http://localhost:8081](http://localhost:8081)
- API Endpoints:
  - GET `/api/poems` - Retrieve all poems
  - GET `/api/poems/{id}` - Retrieve a specific poem by ID

## Database Schema

The MongoDB collection `poems` has the following schema:

```
{
  "_id": ObjectId,
  "title": String,
  "author": String,
  "content": String
}
```

## Implementation Notes

- The backend uses Quarkus MongoDB Panache for simplified database operations
- The frontend fetches poems from the backend API on component mount
- Sample poems are automatically inserted into the database on first run
- The application supports dark/light mode based on system preferences
- CORS is configured to allow the frontend to communicate with the backend
