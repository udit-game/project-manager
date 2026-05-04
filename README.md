# Project Manager

A full-stack web application for managing projects and tasks collaboratively. Built with Spring Boot on the backend and React on the frontend, designed to streamline team project management with role-based access and real-time task tracking.

## 🎯 Features

### Core Functionality

- **User Authentication**: Secure JWT-based authentication with Spring Security
- **Project Management**: Create, manage, and collaborate on projects with team members
- **Task Management**: Create, assign, update, and track tasks with multiple status states
- **User Management**: Manage team members and their roles within projects
- **Multi-user Collaboration**: Role-based access control (Admin, Member)
- **Task Status Tracking**: Track tasks with statuses: TODO, IN_PROGRESS, ON_HOLD, COMPLETED
- **Pagination**: Efficient data loading with paginated API responses

## 🏗️ Architecture

### Tech Stack

**Backend:**

- Java 21
- Spring Boot 4.0.6
- Spring Security + JWT
- Spring Data JPA
- MySQL Database
- Lombok
- Maven

**Frontend:**

- React 19
- TypeScript 6.0
- Vite (Build Tool)
- React Router v7 (Routing)
- Zustand (State Management)
- React Query (Data Fetching)
- Axios (HTTP Client)
- Tailwind CSS (Styling)
- ESLint (Code Quality)

## 📁 Project Structure

```
project-manager/
├── backend/                           # Spring Boot REST API
│   ├── src/main/java/
│   │   └── com/projectManagement/projectManagerBackend/
│   │       ├── Controller/            # REST API endpoints
│   │       │   ├── AuthController.java
│   │       │   ├── ProjectController.java
│   │       │   ├── TaskController.java
│   │       │   └── UserController.java
│   │       ├── Service/               # Business logic
│   │       │   ├── AuthService.java
│   │       │   ├── ProjectService.java
│   │       │   ├── TaskService.java
│   │       │   └── UserService.java
│   │       ├── DAO/                   # Data access layer
│   │       │   ├── Entities/          # JPA entities
│   │       │   ├── Repo/              # Repository interfaces
│   │       │   └── Managers/          # Data managers
│   │       ├── Dtos/                  # Data Transfer Objects
│   │       ├── Middleware/            # Request interceptors
│   │       ├── Exceptions/            # Custom exceptions
│   │       ├── Config/                # Configuration classes
│   │       └── Utils/                 # Utility functions
│   ├── resources/
│   │   └── application.properties     # Configuration
│   └── build.gradle                   # Gradle build config
│
└── frontend/                          # React TypeScript App
    ├── src/
    │   ├── pages/                     # Page components
    │   │   ├── AuthPage.tsx
    │   │   ├── DashboardPage.tsx
    │   │   ├── ProjectsPage.tsx
    │   │   └── Projectdetailpage.tsx
    │   ├── components/                # Reusable components
    │   │   ├── Layout.tsx
    │   │   ├── MultiUserSelector.tsx
    │   │   └── SingleUserSelector.tsx
    │   ├── api/                       # API client modules
    │   │   ├── auth.ts
    │   │   ├── projects.ts
    │   │   ├── tasks.ts
    │   │   └── userApi.ts
    │   ├── hooks/                     # Custom React hooks
    │   │   ├── useProjects.ts
    │   │   ├── useTasks.ts
    │   │   └── useUsers.ts
    │   ├── store/                     # Zustand state management
    │   │   └── authStore.ts
    │   ├── types/                     # TypeScript type definitions
    │   │   └── index.ts
    │   ├── lib/                       # Utility libraries
    │   │   ├── axios.ts               # Axios configuration
    │   │   └── queryClient.ts         # React Query setup
    │   ├── App.tsx                    # Main app component
    │   └── main.tsx                   # App entry point
    ├── public/                        # Static assets
    ├── package.json                   # Dependencies
    ├── tsconfig.json                  # TypeScript config
    ├── vite.config.ts                 # Vite config
    ├── tailwind.config.js             # Tailwind CSS config
    └── eslint.config.js               # ESLint config
```

## 🔌 API Endpoints

### Authentication

```
POST /auth/login           # User login
POST /auth/register        # User registration
```

### Projects

```
GET    /project                    # Get user's projects (paginated)
POST   /project                    # Create project and assign members
POST   /project/{projectId}        # Add members to project
DELETE /project/{projectId}        # Delete project
```

### Tasks

```
POST   /task/{projectId}                    # Create task in project
GET    /task/{projectId}                    # Get tasks (with filters: status, assignedTo)
POST   /task/{projectId}/{taskId}           # Update task
DELETE /task/{projectId}/{taskId}           # Delete task
GET    /task/my-tasks                       # Get tasks assigned to current user
GET    /task/my-projects                    # Get projects with current user's tasks
```

### Users

```
GET    /user                       # Get user information
POST   /user                       # Update user information
```

## 🚀 Getting Started

### Prerequisites

- Java 21+
- Node.js 18+ and npm
- MySQL 8.0+
- Git

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd project-manager/backend
   ```

2. **Configure environment variables**
   Create a `.env` file or set environment variables:

   ```
   DB_URL=jdbc:mysql://localhost:3306/project_manager
   DB_USERNAME=root
   DB_PASSWORD=your_password
   CORS_ALLOWED_ORIGINS=http://localhost:5173
   ```

3. **Build and run**
   ```bash
   ./gradlew bootRun
   ```
   The backend will start on `http://localhost:8080`

### Frontend Setup

1. **Install dependencies**

   ```bash
   cd project-manager/frontend
   npm install
   ```

2. **Start development server**

   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:5173`

3. **Build for production**
   ```bash
   npm run build
   ```

## 📝 Available Scripts

### Backend

- `./gradlew bootRun` - Start the application
- `./gradlew build` - Build the project
- `./gradlew test` - Run tests

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🔐 Security Features

- **JWT Authentication**: Stateless token-based authentication
- **Spring Security**: Role-based access control (ADMIN, MEMBER)
- **CORS Configuration**: Controlled cross-origin requests
- **Password Hashing**: Secure password storage with Spring Security
- **Request Validation**: Server-side validation of all inputs
- **Protected Routes**: Frontend route protection based on authentication

## 🗄️ Database Schema

The application uses MySQL with automatic schema creation via Hibernate. Key entities include:

- **User**: User accounts with authentication details
- **Project**: Project entities with metadata
- **Task**: Task entities with status and assignment tracking
- **ProjectMember**: Junction table for project-user relationships with role assignment

## 🎨 Frontend Features

### Pages

- **Auth Page**: User login and registration
- **Dashboard**: Overview of all projects and tasks
- **Projects Page**: Browse and manage all projects
- **Project Detail Page**: View project-specific tasks and members

### State Management

- **Zustand Store**: User authentication state (token, email)
- **React Query**: Server state management for projects, tasks, and users

### Custom Hooks

- `useProjects()` - Fetch and manage projects
- `useTasks()` - Fetch and manage tasks
- `useUsers()` - Fetch and manage users

## 📡 API Response Format

All API responses follow a consistent format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    message: string;
    code: string;
  };
}
```

## 🔄 Data Models

### TaskDto

```typescript
{
  id: string;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "ON_HOLD" | "COMPLETED";
  assignedToId: string;
  assignedToEmail: string;
  dueDate: string;
  overdue: boolean;
}
```

### ProjectItem

```typescript
{
  id: string;
  name: string;
  role: "ADMIN" | "MEMBER";
  taskCount: number;
}
```

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email support@projectmanager.com or open an issue on the repository.

---

**Built with ❤️ by Udit Jha**
