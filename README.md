# Employee Management System

A comprehensive single-page web application built with Angular 19+ for managing employee information with role-based access control, CRUD operations, and modern UI features.

## Features

### Authentication
- Simulated login system (no backend required)
- Token-based authentication stored in localStorage
- Route guards to protect authenticated routes
- Role-based access control (Admin, Manager, User)

### Employee Dashboard
- Display employees in a Syncfusion Grid
- Pagination, Sorting, and Filtering
- Real-time search functionality
- Department and Status filters
- Lazy loading for optimal performance

### CRUD Operations
- **Create**: Add new employees with form validation
- **Read**: View employee details in card layout
- **Update**: Edit existing employee information
- **Delete**: Remove employees (Admin only)

### Additional Features
- Light/Dark theme toggle with system preference detection
- Global error handler (HTTP interceptor)
- Loading spinner interceptor
- Image upload with preview
- Custom form validations
- Reusable shared components
- State management using Angular Signals

## Technology Stack

- **Framework**: Angular 19+
- **Language**: TypeScript
- **State Management**: Angular Signals
- **Styling**: SCSS
- **UI Components**: Syncfusion Grid
- **Forms**: Reactive Forms with custom validators
- **Routing**: Angular Router with lazy loading
- **HTTP**: Angular HttpClient with interceptors
- **Testing**: Karma + Jasmine

## Project Structure

```
src/
├── app/
│   ├── auth/
│   │   └── login/              # Login component
│   ├── employees/
│   │   ├── employee-dashboard/ # Dashboard with Syncfusion Grid
│   │   ├── employee-form/     # Add/Edit form
│   │   ├── employee-detail/   # Detail view with nested routing
│   │   └── employees.routes.ts # Lazy loaded routes
│   ├── guards/
│   │   ├── auth.guard.ts      # Authentication guard
│   │   └── role.guard.ts       # Role-based guard
│   ├── interceptors/
│   │   ├── error.interceptor.ts    # Global error handler
│   │   └── loading.interceptor.ts # Loading spinner
│   ├── models/
│   │   ├── employee.model.ts  # Employee interfaces
│   │   └── auth.model.ts      # Auth interfaces
│   ├── pipes/
│   │   └── full-name.pipe.ts  # Custom pipe
│   ├── directives/
│   │   └── highlight.directive.ts # Custom directive
│   ├── services/
│   │   ├── auth.service.ts     # Authentication service
│   │   ├── employee.service.ts # Employee CRUD service
│   │   ├── theme.service.ts    # Theme management
│   │   └── loading.service.ts  # Loading state
│   ├── shared/
│   │   └── components/
│   │       ├── loading-spinner/
│   │       ├── theme-toggle/
│   │       ├── image-upload/
│   │       └── unauthorized/
│   ├── validators/
│   │   └── custom.validators.ts # Custom form validators
│   └── app.routes.ts           # Main routing configuration
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
<<<<<<< Updated upstream
# Employee Management System (Angular)

Minimal, maintainable Angular sample app for managing employees — used for learning and assignment purposes.

Quick start
- Install deps: `npm install`
- Dev server: `npm start` or `ng serve`
- Build: `ng build --configuration development`
- Tests: `npm test`

Project highlights
- Standalone Angular components
- In-memory/mock data under `src/assets` for quick local development
- Centralized configuration and constants in `src/app/core/config`
- Core services under `src/app/core/services` — single source of truth

Simplified folder structure (top-level)

 - src/
   - app/
     - app.component.*
     - app.routes.ts
     - core/
       - config/           # appConstants, routes, validation
       - services/         # Auth, Employee, Loading, Theme
       - interfaces/       # service and model interfaces
       - guards/           # route guards
       - interceptors/     # HTTP/interceptor logic
       - models/           # shared models (Auth, Employee)
     - auth/               # login component
     - employees/          # dashboard, form, detail
     - shared/             # components, helpers, pipes, validators,mock data
   - public/               # images, static assets
   - environments/

Notes
- Keep business logic and HTTP-like APIs inside `core/services`.
- Use `src/app/services` only for legacy re-exports if needed by existing imports.
- Run `ng build` after refactors to ensure templates/types remain in sync.

If you want, I can also:
- produce a small CONTRIBUTING.md with development conventions
- run the test suite and fix failing specs


### Demo Credentials

- **Admin**: username: `admin`, password: `admin123`
- **Manager**: username: `manager`, password: `manager123`
- **User**: username: `user`, password: `user123`

## Running Tests

Run unit tests with Karma:
```bash
npm test
```

### Test Coverage

The project includes unit tests for:
- **Components**: LoginComponent
- **Services**: EmployeeService
- **Pipes**: FullNamePipe
- **Validators**: CustomValidators (email domain, phone number, salary range, date validation, image file)

## Code Quality

The project follows SonarQube-compliant standards:

- **Clean Code**: Readable and well-structured
- **Meaningful Naming**: Descriptive variable, function, and class names
- **Single Responsibility**: Each component/service has one clear purpose
- **DRY Principle**: Reusable logic through shared services and utilities
- **Documentation**: Meaningful comments where necessary

## Key Features Implementation

### Authentication
- Simulated login with mock users
- JWT-like token stored in localStorage
- Route guards protect authenticated routes
- Role-based access control

### State Management
- Angular Signals for reactive state management
- Theme service with effect-based persistence
- Loading service for global loading state

### Form Validation
- Built-in Angular validators
- Custom validators:
  - Email domain validation
  - Phone number format
  - Salary range validation
  - Date not in future
  - Image file type and size

### HTTP Interceptors
- Error interceptor: Centralized error handling
- Loading interceptor: Automatic loading spinner

### Theme System
- Light/Dark theme toggle
- System preference detection
- CSS variables for theming
- Smooth transitions

## Role-Based Access

- **Admin**: Full access (Create, Read, Update, Delete)
- **Manager**: Can create, read, and update employees
- **User**: Read-only access

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Build

Build for production:
```bash
npm run build
```

=======
cd employee-management-system-angular
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Navigate to `http://localhost:4200`

### Demo Credentials

- **Admin**: username: `admin`, password: `admin123`
- **Manager**: username: `manager`, password: `manager123`
- **User**: username: `user`, password: `user123`

## Running Tests

Run unit tests with Karma:
```bash
npm test
```

### Test Coverage

The project includes unit tests for:
- **Components**: LoginComponent
- **Services**: EmployeeService
- **Pipes**: FullNamePipe
- **Validators**: CustomValidators (email domain, phone number, salary range, date validation, image file)

## Code Quality

The project follows SonarQube-compliant standards:

- **Clean Code**: Readable and well-structured
- **Meaningful Naming**: Descriptive variable, function, and class names
- **Single Responsibility**: Each component/service has one clear purpose
- **DRY Principle**: Reusable logic through shared services and utilities
- **Documentation**: Meaningful comments where necessary

## Key Features Implementation

### Authentication
- Simulated login with mock users
- JWT-like token stored in localStorage
- Route guards protect authenticated routes
- Role-based access control

### State Management
- Angular Signals for reactive state management
- Theme service with effect-based persistence
- Loading service for global loading state

### Form Validation
- Built-in Angular validators
- Custom validators:
  - Email domain validation
  - Phone number format
  - Salary range validation
  - Date not in future
  - Image file type and size

### HTTP Interceptors
- Error interceptor: Centralized error handling
- Loading interceptor: Automatic loading spinner

### Theme System
- Light/Dark theme toggle
- System preference detection
- CSS variables for theming
- Smooth transitions

## Role-Based Access

- **Admin**: Full access (Create, Read, Update, Delete)
- **Manager**: Can create, read, and update employees
- **User**: Read-only access

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Build

Build for production:
```bash
npm run build
```

>>>>>>> Stashed changes
The build artifacts will be stored in the `dist/` directory.

## License

This project is licensed under the MIT License.
