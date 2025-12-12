export interface Employee {
  id: number;
  firstName: string;
  lastName?: string | null;
  email: string;
  phone?: string;
  department: Department;
  position: string;
  status: EmployeeStatus;
  hireDate: string;   // ISO date
  salary: number;
  imageUrl?: string | null;
}

export enum Department {
  IT = 'IT',
  HR = 'HR',
  FINANCE = 'Finance',
  MARKETING = 'Marketing',
  SALES = 'Sales',
  OPERATIONS = 'Operations'
}

export enum EmployeeStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  ON_LEAVE = 'On Leave'
}

export interface User {
  username: string;
  password: string;
  role: UserRole;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER'
}
