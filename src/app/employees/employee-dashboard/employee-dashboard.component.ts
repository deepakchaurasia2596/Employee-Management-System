// External imports
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GridModule, PageService, SortService, FilterService, SearchService, GridComponent } from '@syncfusion/ej2-angular-grids';
import { Subject, takeUntil, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

// Internal Shared imports
import { EmployeeService } from '../../core/services/employee.service';
import { Employee, Department, EmployeeStatus, UserRole } from '../../core/models/employee.model';
import { AuthService } from '../../core/services/auth.service';
import { appConstants } from '../../core/constants/app.constants';

type GridRow = Employee & { salaryDisplay?: string };

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, GridModule],
  providers: [PageService, SortService, FilterService, SearchService],
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss']
})
export class EmployeeDashboardComponent implements OnInit, OnDestroy {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  gridData: GridRow[] = [];

  searchQuery = '';
  selectedDepartment: Department | null = null;
  selectedStatus: EmployeeStatus | null = null;

  departments = Object.values(Department) as Department[];
  statuses = Object.values(EmployeeStatus) as EmployeeStatus[];

  get canAdd(): boolean {
    return this.authService.hasAnyRole([UserRole.ADMIN, UserRole.MANAGER]);
  }

  get canEdit(): boolean {
    return this.authService.hasAnyRole([UserRole.ADMIN, UserRole.MANAGER]);
  }

  get canDelete(): boolean {
    return this.authService.hasRole(UserRole.ADMIN);
  }

  @ViewChild('grid') grid?: GridComponent;

  filterSettings: any = {
    type: 'FilterBar',
    mode: 'Immediate',
    immediateModeDelay: 300
  };

  pageSettings = {
    pageSize: appConstants.pagination.defaultPageSize,
    pageSizes: appConstants.pagination.pageSizeOptions
  };

  private destroy$ = new Subject<void>();

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const value = (input?.value ?? '').trim();
    this.searchQuery = value;
    this.applyFilters();
  }

  onDepartmentChange(event: Event): void {
    const select = event.target as HTMLSelectElement | null;
    const raw = (select?.value ?? '').trim();
    const dept = raw === '' ? null : (raw as unknown as Department);
    this.selectedDepartment = dept;
    this.applyFilters();
  }

  onStatusChange(event: Event): void {
    const select = event.target as HTMLSelectElement | null;
    const raw = (select?.value ?? '').trim();
    const st = raw === '' ? null : (raw as unknown as EmployeeStatus);
    this.selectedStatus = st;
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedDepartment = null;
    this.selectedStatus = null;
    this.applyFilters();

    // Reset Syncfusion grid filter UI
    setTimeout(() => this.grid?.clearFiltering(), 0);
  }

  onViewEmployee(id: number): void {
    this.router.navigate([appConstants.routes.EmployeesBase, id]);
  }

  onEditEmployee(id: number): void {
    this.router.navigate([appConstants.routes.EmployeeEdit, id]);
  }

  onDeleteEmployee(id: number): void {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    this.removeEmployee(id);
  }

  onAddEmployee(): void {
    this.router.navigate([appConstants.routes.EmployeeAdd]);
  }

  fetchEmployees(): void {
    this.employeeService.getAllEmployees()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (list: Employee[]) => {
          this.employees = list;
          this.filteredEmployees = list;
          this.updateGridData();
        },
        error: (err) => this.logError('fetchEmployees', err)
      });
  }

  /**
   * Attempt to call createEmployee on the real service if present.
   * This guard types createEmployee as returning Observable<Employee>.
   * If the service doesn't expose createEmployee (mock-only), we fallback to local insert.
   */
  createEmployeeIfPresent(payload: Partial<Employee>): void {
    const svc = this.employeeService as Partial<EmployeeService & {
      createEmployee?: (p: Partial<Employee>) => Observable<Employee>
    }>;

    if (typeof svc.createEmployee === 'function') {
      svc.createEmployee!(payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.fetchEmployees(),
          error: (err) => this.logError('createEmployee', err)
        });
      return;
    }

    // Fallback to local insert for mock-only service
    const current = [...this.employees];
    const newId = current.length ? Math.max(...current.map(e => e.id)) + 1 : 1;
    const deptVal = (payload.department as Department) ?? this.departments[0];
    const statusVal = (payload.status as EmployeeStatus) ?? this.statuses[0];

    const newEmp: Employee = {
      id: newId,
      firstName: payload.firstName ?? 'New',
      lastName: payload.lastName ?? 'Employee',
      email: payload.email ?? '',
      phone: payload.phone ?? '',
      department: deptVal,
      position: payload.position ?? '',
      status: statusVal,
      hireDate: payload.hireDate ?? new Date().toISOString().slice(0, 10),
      salary: payload.salary ?? 0
    };

    current.push(newEmp);
    this.employees = current;
    this.applyFilters();
  }

  removeEmployee(id: number): void {
    this.employeeService.deleteEmployee(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastService.success('Employee deleted');
          this.fetchEmployees();
        },
        error: (err) => {
          this.logError('removeEmployee', err);
          this.toastService.error('Error deleting employee');
        }
      });
  }

  private applyFilters(): void {
    const base = [...this.employees];
    const dept = this.selectedDepartment;
    const status = this.selectedStatus;
    const query = this.searchQuery.trim().toLowerCase();

    const afterDept = dept ? base.filter(e => e.department === dept) : base;
    const afterStatus = status ? afterDept.filter(e => e.status === status) : afterDept;
    const finalList = query ? afterStatus.filter(e => this.matchesQuery(e, query)) : afterStatus;

    this.filteredEmployees = finalList;
    this.updateGridData();
  }

  private matchesQuery(emp: Employee, q: string): boolean {
    const query = q;
    return (
      emp.firstName.toLowerCase().includes(query) ||
      (emp.lastName ?? '').toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query) ||
      emp.position.toLowerCase().includes(query) ||
      (emp.phone ?? '').toLowerCase().includes(query)
    );
  }

  private updateGridData(): void {
    const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });
    this.gridData = this.filteredEmployees.map(emp => ({
      ...emp,
      salaryDisplay: formatter.format(emp.salary)
    }));
  }

  private logError(operation: string, err: unknown): void {
    if (err instanceof Error) {
      console.error(`${operation} failed:`, err.message, err);
    } else {
      console.error(`${operation} failed:`, err);
    }
  }

  /**
   * trackBy for employees list.
   * Returns a stable numeric id (keeps DOM nodes when reloading list).
   */
  trackByEmployee(index: number, item: Employee): number {
    return item?.id ?? index;
  }

  /**
   * trackBy for primitive lists like Department or EmployeeStatus.
   * Returns string representation of the primitive/enum value.
   */
  trackByPrimitive(index: number, item: Department | EmployeeStatus): string {
    return String(item);
  }
}
