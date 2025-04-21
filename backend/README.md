# Tunisair Meeting Management Web Application

A Spring Boot backend application for managing meetings, documents, and tasks within Tunisair.

## 🚀 Features

- User authentication and authorization with JWT
- Role-based access control (Admin, Secretary, Board Member)
- Meeting management with participants
- Document upload and versioning
- Task tracking and assignment
- Email notifications and reminders
- Meeting reports generation

## 🛠️ Technology Stack

- Java 17
- Spring Boot 3.2.3
- Spring Security with JWT
- Spring Data JPA
- MySQL 8
- Maven
- Lombok
- SpringDoc OpenAPI (Swagger)

## 📋 Prerequisites

- Java 17 or higher
- MySQL 8 or higher
- Maven 3.6 or higher

## ⚙️ Setup

1. Clone the repository
2. Configure the database:
   - Create a MySQL database named `tunisair_meetings`
   - Update `application.yml` with your database credentials

3. Set up environment variables:
   ```bash
   export MAIL_USERNAME=your-email@gmail.com
   export MAIL_PASSWORD=your-app-specific-password
   export JWT_SECRET=your-256-bit-secret
   ```

4. Build the project:
   ```bash
   mvn clean install
   ```

5. Run the application:
   ```bash
   mvn spring-boot:run
   ```

## 📚 API Documentation

Once the application is running, you can access:
- Swagger UI: http://localhost:8080/api/swagger-ui.html
- OpenAPI docs: http://localhost:8080/api/api-docs

## 🔒 Security

- JWT-based authentication
- Role-based access control
- Password encryption
- Input validation
- CORS configuration
- Secure file upload

## 📁 Project Structure

```
src/main/java/com/tunisair/meetingmanagement/
├── config/          # Configuration classes
├── controller/      # REST controllers
├── model/          # Entity classes
├── repository/     # JPA repositories
├── service/        # Business logic
├── security/       # Security configuration
├── util/           # Utility classes
└── MeetingManagementApplication.java
```

## 👥 Roles and Permissions

1. **ADMIN**
   - Full system access
   - User management
   - Role management

2. **SECRETARY**
   - Meeting management
   - Document management
   - Task assignment

3. **BOARD_MEMBER**
   - View meetings
   - Access documents
   - Update tasks

## 📝 License

This project is proprietary and confidential. Unauthorized copying or distribution is prohibited. 