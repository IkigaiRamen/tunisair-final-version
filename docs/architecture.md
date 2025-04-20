# System Architecture

## Overview
The Tunisair Meeting Management System follows a modern, layered architecture pattern with clear separation of concerns between frontend and backend components.

## Architecture Diagram
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Angular        │     │  Spring Boot    │     │  MySQL          │
│  Frontend       │◄───►│  Backend        │◄───►│  Database       │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Component Architecture

### Frontend (Angular)
- **Modules**:
  - AuthModule: Authentication and authorization
  - MeetingModule: Meeting management
  - DocumentModule: Document handling
  - DashboardModule: Analytics and overview
  - SharedModule: Common components and services

- **Core Features**:
  - Lazy loading for better performance
  - State management using NgRx
  - Responsive design with PrimeFlex
  - Component-based architecture

### Backend (Spring Boot)
- **Layers**:
  - Controller Layer: REST endpoints
  - Service Layer: Business logic
  - Repository Layer: Data access
  - Entity Layer: Data models

- **Security**:
  - JWT-based authentication
  - Role-based authorization
  - CORS configuration
  - Input validation

### Database (MySQL)
- **Schema**:
  - Users and Roles
  - Meetings and Participants
  - Documents and Versions
  - Decisions and Tasks
  - Audit Logs

## Data Flow
1. Frontend makes HTTP requests to backend
2. Backend validates requests and processes business logic
3. Data is persisted in MySQL
4. Responses are sent back to frontend
5. Frontend updates UI accordingly

## Security Architecture
- JWT tokens for authentication
- Role-based access control
- HTTPS for all communications
- Input validation and sanitization
- Audit logging for sensitive operations

## Integration Points
- RESTful API endpoints
- WebSocket for real-time updates
- File upload/download endpoints
- Email notification system

## Deployment Architecture
- Frontend: Served via NGINX
- Backend: Spring Boot JAR
- Database: MySQL on dedicated server
- CI/CD: Automated deployment pipeline 