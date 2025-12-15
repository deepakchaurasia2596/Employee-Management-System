// employee.service.spec.ts
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EmployeeService } from './employee.service';
import { Employee, Department, EmployeeStatus } from '../../core/models/employee.model';

// Import the project's mock employees JSON from assets.
// Using the 'src' path is usually safe in Angular/Karma environments.
import mockEmployeesJson from '../../shared/mockData/mock-employees.json';
const MOCK_EMPLOYEES = (mockEmployeesJson as unknown) as Employee[];

describe('EmployeeService', () => {
  let service: EmployeeService;

  // delays used in the service (keep in sync with service implementation)
  const DELAY_GET_ALL = 300;
  const DELAY_GET_ONE = 200;
  const DELAY_MUTATE = 300;
  const DELAY_SEARCH = 200;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployeeService]
    });
    service = TestBed.inject(EmployeeService);

    // Seed the in-memory employees so tests are deterministic and independent
    // (we access private members here for testing purposes only)
    (service as any).employees = MOCK_EMPLOYEES.map(e => ({ ...e }));
    (service as any).nextId = Math.max(...MOCK_EMPLOYEES.map(e => e.id || 0)) + 1;
  });

  /* ==========================
     Service initialization
     ========================== */
  it('should create the service', () => {
    // Arrange / Act: setup already done by TestBed
    // Assert
    expect(service).toBeTruthy();
  });

  /* ==========================
     getAllEmployees
     ========================== */
  it('getAllEmployees should return all employees (with delay)', fakeAsync(() => {
    // Act
    let result: Employee[] | undefined;
    service.getAllEmployees().subscribe(res => (result = res));
    tick(DELAY_GET_ALL);

    // Assert
    expect(result).toBeDefined();
    expect(result!.length).toBeGreaterThan(0);
    expect(result![0]).toEqual(jasmine.objectContaining({ id: MOCK_EMPLOYEES[0].id, firstName: MOCK_EMPLOYEES[0].firstName }));
  }));

  /* ==========================
     getEmployeeById
     ========================== */
  it('getEmployeeById should return employee for existing id', fakeAsync(() => {
    // Act
    const idToFetch = MOCK_EMPLOYEES[0].id!;
    let result: Employee | undefined;
    service.getEmployeeById(idToFetch).subscribe(res => (result = res));
    tick(DELAY_GET_ONE);

    // Assert
    expect(result).toBeDefined();
    expect(result!.id).toBe(idToFetch);
    expect(result!.firstName).toBe(MOCK_EMPLOYEES[0].firstName);
  }));

  it('getEmployeeById should throw for non-existent id', fakeAsync(() => {
    // Act
    let caught: any;
    service.getEmployeeById(999).subscribe({
      next: () => {},
      error: err => (caught = err)
    });
    tick();

    // Assert
    expect(caught).toBeDefined();
    expect(caught.message).toBe('Employee with id 999 not found');
  }));

  /* ==========================
     addEmployee
     ========================== */
  it('addEmployee should add a new employee and return it', fakeAsync(() => {
    // Arrange
    const payload: Omit<Employee, 'id'> = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1-111-222-3333',
      department: Department.IT,
      position: 'Developer',
      status: EmployeeStatus.ACTIVE,
      hireDate: '2023-01-01',
      salary: 60000
    };

    // Act
    let added: Employee | undefined;
    service.addEmployee(payload).subscribe(res => (added = res));
    tick(DELAY_MUTATE);

    // Assert
    expect(added).toBeDefined();
    expect(added!.id).toBeDefined();
    expect(added!.firstName).toBe('John');

    // confirm added appears in getAllEmployees
    let all: Employee[] | undefined;
    service.getAllEmployees().subscribe(res => (all = res));
    tick(DELAY_GET_ALL);
    expect(all!.some(e => e.id === added!.id)).toBeTrue();
  }));

  /* ==========================
     updateEmployee
     ========================== */
  it('updateEmployee should update an existing employee and return it', fakeAsync(() => {
    // Arrange
    const existingId = MOCK_EMPLOYEES[0].id!;
    const updates: Partial<Employee> & { salary?: number } = { salary: 1000000 };

    // Act
    let updated: Employee | undefined;
    service.updateEmployee(existingId, updates).subscribe(res => (updated = res));
    tick(DELAY_MUTATE);

    // Assert
    expect(updated).toBeDefined();
    expect(updated!.id).toBe(existingId);
    expect(updated!.salary).toBe(1000000);
  }));

  it('updateEmployee should throw when updating non-existent employee', fakeAsync(() => {
    // Arrange
    const updates: Partial<Employee> = { salary: 1000000 };

    // Act
    let caught: any;
    service.updateEmployee(999, updates).subscribe({
      next: () => {},
      error: err => (caught = err)
    });
    tick(DELAY_MUTATE);

    // Assert
    expect(caught).toBeDefined();
    expect(caught.message).toBe('Employee with id 999 not found');
  }));

  /* ==========================
     deleteEmployee
     ========================== */
  it('deleteEmployee should remove existing employee and return true', fakeAsync(() => {
    // Act
    const idToDelete = MOCK_EMPLOYEES[0].id!;
    let result: boolean | undefined;
    service.deleteEmployee(idToDelete).subscribe(res => (result = res));
    tick(DELAY_MUTATE);

    // Assert
    expect(result).toBeTrue();

    // confirm removed
    let all: Employee[] | undefined;
    service.getAllEmployees().subscribe(res => (all = res));
    tick(DELAY_GET_ALL);
    expect(all!.some(e => e.id === idToDelete)).toBeFalse();
  }));

  it('deleteEmployee should throw for non-existent id', fakeAsync(() => {
    // Act
    let caught: any;
    service.deleteEmployee(999).subscribe({
      next: () => {},
      error: err => (caught = err)
    });
    tick(DELAY_MUTATE);

    // Assert
    expect(caught).toBeDefined();
    expect(caught.message).toBe('Employee with id 999 not found');
  }));

  /* ==========================
     searchEmployees
     ========================== */
  it('searchEmployees should return matches for a query', fakeAsync(() => {
    // Act
    const q = (MOCK_EMPLOYEES[0].firstName || '').slice(0, 3);
    let results: Employee[] | undefined;
    service.searchEmployees(q).subscribe(res => (results = res));
    tick(DELAY_SEARCH);

    // Assert
    expect(results).toBeDefined();
    expect(results!.length).toBeGreaterThan(0);
    expect(results![0].firstName.toLowerCase()).toContain(q.toLowerCase());
  }));

  it('searchEmployees should return empty array when no matches', fakeAsync(() => {
    // Act
    let results: Employee[] | undefined;
    service.searchEmployees('nonexistent').subscribe(res => (results = res));
    tick(DELAY_SEARCH);

    // Assert
    expect(results).toBeDefined();
    expect(results).toEqual([]);
  }));

  /* ==========================
     filterByDepartment
     ========================== */
  it('filterByDepartment should return employees for a department', fakeAsync(() => {
    // Act
    let results: Employee[] | undefined;
    service.filterByDepartment(Department.IT).subscribe(res => (results = res));
    tick(DELAY_SEARCH);

    // Assert
    expect(results).toBeDefined();
    expect(results!.every(emp => emp.department === Department.IT)).toBeTrue();
  }));

  it('filterByDepartment should return all employees when department is null', fakeAsync(() => {
    // Act
    let results: Employee[] | undefined;
    service.filterByDepartment(null).subscribe(res => (results = res));
    tick(DELAY_GET_ALL);

    // Assert
    expect(results).toBeDefined();
    expect(results!.length).toBeGreaterThan(0);
  }));

  /* ==========================
     filterByStatus
     ========================== */
  it('filterByStatus should return employees for a status', fakeAsync(() => {
    // Act
    let results: Employee[] | undefined;
    service.filterByStatus(EmployeeStatus.ACTIVE).subscribe(res => (results = res));
    tick(DELAY_SEARCH);

    // Assert
    expect(results).toBeDefined();
    expect(results!.every(emp => emp.status === EmployeeStatus.ACTIVE)).toBeTrue();
  }));

  it('filterByStatus should return all employees when status is null', fakeAsync(() => {
    // Act
    let results: Employee[] | undefined;
    service.filterByStatus(null).subscribe(res => (results = res));
    tick(DELAY_GET_ALL);

    // Assert
    expect(results).toBeDefined();
    expect(results!.length).toBeGreaterThan(0);
  }));
});
