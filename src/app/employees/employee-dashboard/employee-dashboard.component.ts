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
import { SfButtonComponent } from '../../shared/components/sf-button/sf-button.component';
import { SfDropdownComponent } from '../../shared/components/sf-dropdown/sf-dropdown.component';

type GridRow = Employee & { salaryDisplay?: string };

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, GridModule, SfButtonComponent, SfDropdownComponent],
  providers: [PageService, SortService, FilterService, SearchService],
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss']
})
export class EmployeeDashboardComponent implements OnInit, OnDestroy {
  // Data
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  gridData: GridRow[] = [];

  searchQuery = '';
  selectedDepartment: Department | null = null;
  selectedStatus: EmployeeStatus | null = null;

  // ViewChild for Grid
  @ViewChild('grid') grid?: GridComponent;

  // Dropdown Data
  departments = Object.values(Department) as Department[];
  statuses = Object.values(EmployeeStatus) as EmployeeStatus[];

  departmentDropdownOptions = [
    { text: 'All Departments', value: '' },
    ...Object.values(Department).map(d => ({ text: d, value: d }))
  ];

  statusDropdownOptions = [
    { text: 'All Statuses', value: '' },
    ...Object.values(EmployeeStatus).map(s => ({ text: s, value: s }))
  ];

  // Grid Configuration
  filterSettings = {
    type: 'FilterBar',
    mode: 'Immediate',
    immediateModeDelay: 300
  };

  pageSettings = {
    pageSize: appConstants.pagination.defaultPageSize,
    pageSizes: appConstants.pagination.pageSizeOptions
  };

  get canAdd(): boolean {
    return this.authService.hasAnyRole([UserRole.ADMIN, UserRole.MANAGER]);
  }

  get canEdit(): boolean {
    return this.authService.hasAnyRole([UserRole.ADMIN, UserRole.MANAGER]);
  }

  get canDelete(): boolean {
    return this.authService.hasRole(UserRole.ADMIN);
  }

  private destroy$ = new Subject<void>();

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastrService
  ) { }

  ngOnInit(): void {
    this.fetchEmployees();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement)?.value.trim() || '';
    this.applyFilters();
  }

  onDepartmentDropdownChange(value: string): void {
    this.selectedDepartment = value ? (value as Department) : null;
    this.applyFilters();
  }

  onStatusDropdownChange(value: string): void {
    this.selectedStatus = value ? (value as EmployeeStatus) : null;
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedDepartment = null;
    this.selectedStatus = null;
    this.applyFilters();
    setTimeout(() => this.grid?.clearFiltering(), 0);
  }

  onAddEmployee(): void {
    this.router.navigate([appConstants.routes.EmployeeAdd]);
  }

  onViewEmployee(id: number): void {
    this.router.navigate([appConstants.routes.EmployeeView, id]);
  }

  onEditEmployee(id: number): void {
    this.router.navigate([appConstants.routes.EmployeeEdit, id]);
  }

  onDeleteEmployee(id: number): void {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    this.removeEmployee(id);
  }

  // API Calls

  fetchEmployees(): void {
    this.employeeService.getAllEmployees()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: employees => {
          this.employees = employees;
          this.filteredEmployees = employees;
          this.updateGridData();
        },
        error: err => this.logError('fetchEmployees', err)
      });
  }

  removeEmployee(id: number): void {
    this.employeeService.deleteEmployee(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastService.success('Employee deleted');
          this.fetchEmployees();
        },
        error: err => {
          this.logError('removeEmployee', err);
          this.toastService.error('Error deleting employee');
        }
      });
  }

  private applyFilters(): void {
    let list = [...this.employees];

    if (this.selectedDepartment) {
      list = list.filter(e => e.department === this.selectedDepartment);
    }

    if (this.selectedStatus) {
      list = list.filter(e => e.status === this.selectedStatus);
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(e => this.matchesQuery(e, q));
    }

    this.filteredEmployees = list;
    this.updateGridData();
  }

  private matchesQuery(emp: Employee, q: string): boolean {
    return (
      emp.firstName.toLowerCase().includes(q) ||
      (emp.lastName ?? '').toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q) ||
      emp.position.toLowerCase().includes(q) ||
      (emp.phone ?? '').toLowerCase().includes(q)
    );
  }

  private updateGridData(): void {
    const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });
    this.gridData = this.filteredEmployees.map(emp => ({
      ...emp,
      salaryDisplay: formatter.format(emp.salary)
    }));
  }

  private logError(operation: string, error: unknown): void {
    console.error(`${operation} failed`, error);
  }

  trackByEmployee(_: number, emp: Employee): number {
    return emp.id;
  }
}
