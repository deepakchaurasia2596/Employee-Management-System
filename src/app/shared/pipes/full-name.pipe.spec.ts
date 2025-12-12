import { FullNamePipe } from './full-name.pipe';
import { Employee, Department, EmployeeStatus } from '../../core/models/employee.model';

describe('FullNamePipe', () => {
  let pipe: FullNamePipe;

  // Utility factory for test employees
  function createEmployee(overrides: Partial<Employee> = {}): Employee {
    return {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1-234-567-8900',
      department: Department.IT,
      position: 'Developer',
      status: EmployeeStatus.ACTIVE,
      hireDate: '2020-01-15',
      salary: 70000,
      ...overrides
    };
  }

  beforeEach(() => {
    pipe = new FullNamePipe();
  });

  it('should create the pipe instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return full name when firstName and lastName exist', () => {
    // Arrange
    const employee = createEmployee();

    // Act
    const result = pipe.transform(employee);

    // Assert
    expect(result).toBe('John Doe');
  });

  it('should return empty string when employee is null', () => {
    // Arrange / Act
    const result = pipe.transform(null);

    // Assert
    expect(result).toBe('');
  });

  it('should return empty string when employee is undefined', () => {
    // Arrange / Act
    const result = pipe.transform(undefined);

    // Assert
    expect(result).toBe('');
  });

  it('should return only first name when last name is empty', () => {
    // Arrange
    const employee = createEmployee({ lastName: '' });

    // Act
    const result = pipe.transform(employee);

    // Assert
    expect(result).toBe('John');
  });

  it('should trim extra whitespace from first and last name', () => {
    // Arrange
    const employee = createEmployee({
      firstName: '  John  ',
      lastName: '  Doe  '
    });

    // Act
    const result = pipe.transform(employee);

    // Assert
    expect(result).toBe('John Doe');
  });

  it('should handle missing last name gracefully', () => {
    // Arrange
    const employee = createEmployee({ lastName: undefined as unknown as string });

    // Act
    const result = pipe.transform(employee);

    // Assert
    expect(result).toBe('John');
  });

  it('should handle missing first name gracefully', () => {
    // Arrange
    const employee = createEmployee({ firstName: '' });

    // Act
    const result = pipe.transform(employee);

    // Assert
    expect(result).toBe('Doe');
  });
});
