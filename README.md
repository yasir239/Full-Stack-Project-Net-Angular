# Enterprise Student Registration System

A complete full-stack web application designed for managing student registrations with enterprise-grade architecture. Built using ASP.NET Core 8 Web API for a robust, Clean Architecture backend and Angular 17+ with standalone components for a fast, reactive frontend. Features include full CRUD operations, pagination, FluentValidation, and a beautiful Bootstrap 5 UI.

### App Screenshots
![Student List UI](docs/student_list_ui.png)
![Student Form UI](docs/student_form_ui.png)

## Architecture

### Backend (ASP.NET Core 8)
- **Clean Architecture** with 4 layers: Domain → Infrastructure → Application → API
- **Repository Pattern + Unit of Work** for data access abstraction
- **AutoMapper** for entity ↔ DTO mapping
- **FluentValidation** for model validation
- **Global Exception Middleware** returning `ProblemDetails`
- **Pagination, Sorting, Filtering** on the GET endpoint
- Fully **async/await** throughout

### Frontend (Angular 17+)
- **Standalone components** (no NgModules)
- **Reactive Forms** with inline validation messages
- **Angular Signals** for state management
- **HTTP Interceptors** for global error handling and loading spinner
- **Bootstrap 5** with premium custom styling
- Toast notifications and confirmation dialogs

## Quick Start

### Docker (recommended)
```bash
docker-compose up --build
```
- Frontend: http://localhost:4200
- API + Swagger: http://localhost:5000/swagger

### Manual
```bash
# Backend
cd backend/StudentRegistration.API
dotnet run

# Frontend
cd frontend
npm install
ng serve
```

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Backend | ASP.NET Core 8, EF Core 8, SQL Server |
| Frontend | Angular 17, Bootstrap 5, TypeScript |
| Infrastructure | Docker, Docker Compose, Nginx |
