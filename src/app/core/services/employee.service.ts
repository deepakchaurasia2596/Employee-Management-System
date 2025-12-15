// Angular imports
import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';

// Internal imports
import { Employee, Department, EmployeeStatus } from '../models/employee.model';

//Mock employees data
import  mockEmployeesJsonData from '../../shared/mockData/mock-employees.json';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employees: Employee[] = [];

  private nextId = 1;

  constructor() {
    this.loadMockData();
  }

  private loadMockData(): void {
    try {
      const data = (mockEmployeesJsonData as unknown) as Employee[];
      this.employees = data.map(emp => ({
        ...emp,
        department: emp.department as Department,
        status: emp.status as EmployeeStatus
      }));
      const maxId = this.employees.reduce((m, e) => Math.max(m, e.id || 0), 0);
      this.nextId = maxId + 1;
    } catch (err) {
      console.error('Failed to initialize mock employees from JSON import:', err);
      this.employees = [];
      this.nextId = 1;
    }
  }

  getAllEmployees(): Observable<Employee[]> {
    return of([...this.employees]).pipe(delay(300));
  }

  getEmployeeById(id: number): Observable<Employee> {
    const employee = this.employees.find(emp => emp.id === id);
    if (employee) {
      return of(employee).pipe(delay(200));
    }
    return throwError(() => new Error(`Employee with id ${id} not found`));
  }

  addEmployee(employee: Omit<Employee, 'id'>): Observable<Employee> {
    const newEmployee: Employee = {
      ...employee,
      id: this.nextId++
    };
    this.employees.push(newEmployee);
    return of(newEmployee).pipe(delay(300));
  }

  updateEmployee(id: number, employee: Partial<Employee>): Observable<Employee> {
    const index = this.employees.findIndex(emp => emp.id === id);
    if (index === -1) {
      return throwError(() => new Error(`Employee with id ${id} not found`));
    }
    this.employees[index] = { ...this.employees[index], ...employee };
    return of(this.employees[index]).pipe(delay(300));
  }

  deleteEmployee(id: number): Observable<boolean> {
    const index = this.employees.findIndex(emp => emp.id === id);
    if (index === -1) {
      return throwError(() => new Error(`Employee with id ${id} not found`));
    }
    this.employees.splice(index, 1);
    return of(true).pipe(delay(300));
  }

  searchEmployees(query: string): Observable<Employee[]> {
    const lowerQuery = query.toLowerCase();
    const filtered = this.employees.filter(emp =>
      emp.firstName.toLowerCase().includes(lowerQuery) ||
      (emp.lastName ?? '').toLowerCase().includes(lowerQuery) ||
      emp.email.toLowerCase().includes(lowerQuery) ||
      emp.position.toLowerCase().includes(lowerQuery)
    );
    return of(filtered).pipe(delay(200));
  }

  filterByDepartment(department: Department | null): Observable<Employee[]> {
    if (!department) {
      return this.getAllEmployees();
    }
    const filtered = this.employees.filter(emp => emp.department === department);
    return of(filtered).pipe(delay(200));
  }

  filterByStatus(status: EmployeeStatus | null): Observable<Employee[]> {
    if (!status) {
      return this.getAllEmployees();
    }
    const filtered = this.employees.filter(emp => emp.status === status);
    return of(filtered).pipe(delay(200));
  }
}

