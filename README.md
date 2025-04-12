# Event Management System

A comprehensive event management platform with a Node.js/Express backend API and React frontend. This system allows users to browse events, register for events, and includes an admin panel for event and user management.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Backend](#backend)
  - [Tech Stack](#tech-stack-backend)
  - [API Endpoints](#api-endpoints)
  - [Data Models](#data-models)
  - [Authentication and Authorization](#authentication-and-authorization)
  - [Caching Strategy](#caching-strategy)
  - [Error Handling](#error-handling)
  - [Logging](#logging)
- [Frontend](#frontend)
  - [Tech Stack](#tech-stack-frontend)
  - [Features](#frontend-features)
- [Setup and Installation](#setup-and-installation)
- [Deployment](#deployment)

## Overview

The Event Management System is a full-stack application designed to facilitate event creation, management, and registration. It features role-based access control with different permissions for regular users, admins, and super admins.

## Features

- User authentication and authorization
- Event browsing with filters
- Event registration system with approval workflow
- Admin panel for event management
- Super admin capabilities for system management
- Redis caching for improved performance
- Comprehensive error handling and logging

## Architecture

The application follows a client-server architecture:

- **Backend**: RESTful API built with Node.js and Express
- **Frontend**: [TBD] React-based SPA
- **Database**: MongoDB for data persistence
- **Caching**: Redis for improved performance
- **Authentication**: JWT-based authentication system

## Backend

### Tech Stack (Backend)

- **Node.js**: JavaScript runtime environment
- **Express**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM (Object Data Modeling)
- **Redis**: In-memory data store for caching
- **JWT**: JSON Web Tokens for authentication
- **Winston**: Logging library

### API Endpoints

#### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/auth/signup | Register a new user | Public |
| POST | /api/auth/login | Login user | Public |
| GET | /api/auth/me | Get current user profile | Private |
| GET | /api/auth/logout | Logout user | Private |

#### Events

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/events | Get all events | Public |
| GET | /api/events/:id | Get single event | Public |
| POST | /api/events | Create new event | Admin |
| PUT | /api/events/:id | Update event | Admin |
| DELETE | /api/events/:id | Delete event | Admin |

#### Registrations

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/events/:eventId/register | Register for an event | Private |
| GET | /api/registrations | Get user's registrations | Private |
| DELETE | /api/registrations/:id | Cancel registration | Private |

#### Admin

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/admin/registrations | Get pending registrations | Admin |
| PUT | /api/admin/registrations/:id/approve | Approve registration | Admin |
| PUT | /api/admin/registrations/:id/reject | Reject registration | Admin |
| GET | /api/admin/stats | Get admin statistics | Admin |

#### Super Admin

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/superadmin/admins | Create admin user | Super Admin |
| GET | /api/superadmin/admins | Get all admin users | Super Admin |
| DELETE | /api/superadmin/admins/:id | Delete an admin user | Super Admin |

### Data Models

#### User Model

```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  role: String (enum: ['user', 'admin', 'superadmin']),
  createdAt: Date
}
```

#### Event Model

```javascript
{
  title: String,
  description: String,
  date: Date,
  location: String,
  price: Number,
  category: String,
  capacity: Number,
  availableSpots: Number,
  createdBy: User Reference,
  createdAt: Date
}
```

#### Registration Model

```javascript
{
  user: User Reference,
  event: Event Reference,
  status: String (enum: ['pending', 'approved', 'rejected']),
  statusReason: String,
  createdAt: Date
}
```

### Authentication and Authorization

The system uses JSON Web Tokens (JWT) for authentication. When a user logs in, a JWT token is generated and returned to the client. This token must be included in the Authorization header for protected routes.

Role-based access control is implemented with three user roles:
- **User**: Can browse events and register for events
- **Admin**: Can create, update, and delete events, and manage event registrations
- **Super Admin**: Has full system access including admin user management

### Caching Strategy

Redis is used to cache frequently accessed data:

- Event listings are cached for faster retrieval
- Individual event details are cached by ID
- Cache invalidation occurs on event creation, update, or deletion
- Cache entries expire after a configurable time period

Example Redis caching implementation:

```javascript
// Cache event data
await cacheData('events:list', events);

// Retrieve cached event data
const cachedEvents = await getCachedData('events:list');

// Invalidate cache on updates
await deleteCachedData('events:list');
```

### Error Handling

The application implements a centralized error handling middleware that:

- Logs errors with appropriate severity levels
- Returns standardized error responses
- Handles different types of errors (validation, authentication, not found, etc.)

Example error response:

```json
{
  "success": false,
  "error": "Event not found"
}
```

### Logging

Winston is used for logging with different log levels:

- **Error**: For critical errors that affect functionality
- **Warn**: For non-critical issues
- **Info**: For tracking normal application flow
- **Debug**: For detailed debugging information

Logs include timestamps, request details, and contextual information to facilitate debugging and monitoring.

## Frontend

[This section will be completed after the frontend implementation]

### Tech Stack (Frontend)

TBD

### Frontend Features

TBD

## Setup and Installation

### Prerequisites

- Node.js (v14+)
- MongoDB
- Redis

### Backend Setup

1. Clone the repository
   ```bash
   git clone https://github.com/AjayKumarR24430/Event-Registration.git
   cd Event-Registration/backend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the server
   ```bash
   npm run dev
   ```

## Deployment

### Backend Deployment

1. Set up production environment variables
3. Start the server
   ```bash
   npm run start
   ```