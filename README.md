# Tunisair Meeting Management System

## 📋 Project Overview
A comprehensive meeting management system for Tunisair, facilitating meeting organization, document management, and decision tracking.

## 🛠 Tech Stack
- **Frontend**: Angular + PrimeNG + PrimeFlex
- **Backend**: Spring Boot (Controller-Service-Repository Pattern)
- **Database**: MySQL
- **API**: RESTful
- **Security**: Spring Security + JWT

## 📁 Project Structure
```
tunisair-meeting-management/
├── frontend/                 # Angular frontend application
├── backend/                  # Spring Boot backend application
├── docs/                     # Project documentation
│   ├── architecture.md       # System architecture
│   ├── technical.md          # Technical specifications
│   └── status.md            # Project status tracking
├── tasks/                    # Development tasks
│   └── tasks.md             # Current tasks and requirements
└── fixes/                    # Documented solutions to complex issues
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- Java 17+
- MySQL 8.0+
- Angular CLI
- Maven

### Installation
1. Clone the repository
2. Set up the backend:
   ```bash
   cd backend
   mvn install
   ```
3. Set up the frontend:
   ```bash
   cd frontend
   npm install
   ```

### Development
- Backend: `mvn spring-boot:run`
- Frontend: `ng serve`

## 📚 Documentation
- [Architecture Overview](docs/architecture.md)
- [Technical Specifications](docs/technical.md)
- [Development Tasks](tasks/tasks.md)
- [Project Status](docs/status.md)

## 🔒 Security
- All sensitive data is stored securely
- JWT-based authentication
- Role-based access control
- Input validation and sanitization

## 🤝 Contributing
1. Follow the project's coding standards
2. Create feature branches
3. Submit pull requests with clear descriptions
4. Ensure all tests pass

## 📄 License
This project is proprietary and confidential.

## 📞 Support
For support, contact the development team. 