# XEdu.NET - Learning Management System

## 📖 Overview

XEdu.NET is a comprehensive Learning Management System (LMS) migrated from SpringBoot to .NET Core 8.0. The system provides a complete educational platform with course management, online examinations, virtual classrooms, and user authentication.

## 🚀 Features

### 🎓 Learning Management
- **Course Catalog**: Browse and search courses with filtering by subject, grade, and level
- **Free & Paid Courses**: Flexible pricing model with enrollment tracking
- **Video Lessons**: YouTube integration with progress tracking
- **Course Enrollment**: Student enrollment with payment processing support

### 📝 Online Examination System
- **Question Bank**: Comprehensive question management with multiple choice, true/false, fill-in-blank, and essay questions
- **Automatic Grading**: Real-time scoring with immediate feedback
- **Randomized Tests**: Question and answer shuffling for exam integrity
- **Multiple Attempts**: Configurable retry policies with attempt tracking
- **Timer-based Exams**: Controlled exam duration with automatic submission

### 🏫 Virtual Classroom Management
- **Classroom Creation**: Teachers can create and manage virtual classrooms
- **Student Enrollment**: Easy student management with unique class codes
- **Course Assignment**: Assign courses and exams to specific classrooms
- **Progress Monitoring**: Track student progress across courses and exams

### 🔐 Authentication & Authorization
- **Multi-provider Auth**: Local, Google, and Facebook OAuth integration
- **Role-based Access**: Admin, Teacher, Student, and Guest roles
- **JWT Security**: Token-based authentication with secure API access
- **Email Verification**: Account verification system

### 📊 Analytics & Reporting
- **Dashboard Statistics**: Admin and teacher analytics
- **Progress Tracking**: Student course and exam progress
- **Performance Metrics**: Detailed scoring and completion rates

## 🏗️ Architecture

### Clean Architecture Pattern
```
┌─────────────────────────────────────┐
│            XEdu.Api                 │
│     (Controllers, Middleware)       │
├─────────────────────────────────────┤
│         XEdu.Infrastructure         │  
│    (Repositories, Services, Data)   │
├─────────────────────────────────────┤
│           XEdu.Core                 │
│     (Entities, Interfaces, DTOs)    │
└─────────────────────────────────────┘
```

### Technology Stack
- **Backend**: .NET Core 8.0, ASP.NET Core Web API
- **ORM**: Entity Framework Core with MySQL
- **Authentication**: ASP.NET Core Identity + JWT Bearer
- **Frontend**: React 19.1.0 with TypeScript, Tailwind CSS
- **Database**: MySQL 8.0
- **Containerization**: Docker & Docker Compose

## 🗄️ Database Schema

### Core Entities
- **Users**: Authentication and user profiles
- **Subjects/Grades/Topics**: Academic categorization
- **Courses**: Course content and metadata
- **Lessons**: Individual course lessons with video support
- **Classrooms**: Virtual classroom management
- **Exams**: Online examination system
- **Questions/Answers**: Question bank with multiple types
- **Enrollments**: Student course enrollments with payment tracking

### Key Relationships
- User → Courses (Teacher relationship)
- Course → Lessons (One-to-Many)
- Exam → Questions (Many-to-Many via ExamQuestion)
- Classroom → Students (Many-to-Many via ClassroomStudent)

## 🚀 Getting Started

### Prerequisites
- .NET 8.0 SDK
- Node.js 18+
- MySQL 8.0
- Docker (optional)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd xedu.net
   ```

2. **Backend Setup**
   ```bash
   # Restore NuGet packages
   dotnet restore
   
   # Update database connection string in appsettings.json
   # Run database migrations
   dotnet ef database update --project XEdu.Infrastructure --startup-project XEdu.Api
   
   # Start the API
   dotnet run --project XEdu.Api
   ```

3. **Frontend Setup**
   ```bash
   cd ui
   npm install
   npm start
   ```

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build -d
   ```

2. **Access the application**
   - Frontend: http://localhost:8804
   - Backend API: http://localhost:8803
   - Swagger UI: http://localhost:8803/swagger

## 🔧 Configuration

### Database Configuration
Update the connection string in `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=xedu;User=root;Password=password;"
  }
}
```

### JWT Configuration
Configure JWT settings:
```json
{
  "Jwt": {
    "Secret": "your-256-bit-secret-key-here",
    "Expiration": 86400
  }
}
```

### OAuth Configuration
Add OAuth provider settings for Google and Facebook authentication.

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user profile
- `GET /api/auth/test` - Health check

### Courses
- `GET /api/courses` - Get all courses with filtering
- `GET /api/courses/{id}` - Get course details
- `POST /api/courses/{id}/enroll` - Enroll in course
- `GET /api/courses/my-courses` - Get user's enrolled courses

### Exams
- `GET /api/exams` - Get published exams
- `POST /api/exams/{id}/start` - Start exam attempt
- `POST /api/exams/attempt/{id}/submit` - Submit exam

## 🧪 Testing

### Run Unit Tests
```bash
dotnet test
```

### API Testing
Use the built-in Swagger UI at `/swagger` for API testing and documentation.

## 🚀 Deployment

### Production Deployment
1. Configure production environment variables
2. Set up MySQL database
3. Deploy using Docker Compose or cloud platforms
4. Configure reverse proxy (Nginx) for HTTPS

### Environment Variables
- `ASPNETCORE_ENVIRONMENT`: Production/Development
- `ConnectionStrings__DefaultConnection`: Database connection string
- `Jwt__Secret`: JWT signing key

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Email: support@xedu.net
- Documentation: [Project Wiki]
- Issues: [GitHub Issues]

## 🔄 Migration from SpringBoot

This project was successfully migrated from SpringBoot to .NET Core 8.0, maintaining:
- ✅ Complete feature parity
- ✅ Database schema compatibility
- ✅ API contract consistency
- ✅ React frontend integration
- ✅ Docker containerization
- ✅ Authentication & authorization

### Key Migration Changes
- Java/Groovy → C#
- Spring Data JPA → Entity Framework Core
- Spring Security → ASP.NET Core Identity
- Maven → .NET CLI
- SpringBoot configuration → appsettings.json

---

🎯 **Built with .NET Core 8.0 for modern, scalable educational technology**