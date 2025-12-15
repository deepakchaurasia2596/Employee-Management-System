// Angular imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

// Internal imports
import { EmployeeService } from '../../core/services/employee.service';
import { Employee, EmployeeStatus, UserRole } from '../../core/models/employee.model';
import { appConstants } from '../../core/constants/app.constants';
import { FullNamePipe } from '../../shared/pipes/full-name.pipe';
import { AuthService } from '../../core/services/auth.service';
import { SfButtonComponent } from '../../shared/components/sf-button/sf-button.component';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FullNamePipe , SfButtonComponent],
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent implements OnInit, OnDestroy {
  employee: Employee | null = null;
  loading = true;

  // enum to template
  readonly EmployeeStatus = EmployeeStatus;

  // Default image path
  readonly defaultImage = 'images/default-profile.png';

  get canEdit(): boolean {
    return this.authService.hasAnyRole([UserRole.ADMIN, UserRole.MANAGER]);
  }

  get canDelete(): boolean {
    return this.authService.hasRole(UserRole.ADMIN);
  }

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : 0;

    if (!id) {
      this.router.navigate([appConstants.routes.EmployeesBase]);
      return;
    }

    this.loadEmployee(id);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadEmployee(id: number): void {
    this.loading = true;

    this.employeeService.getEmployeeById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (emp: Employee | null) => {
          this.employee = emp;
          this.loading = false;
          if (!emp) this.router.navigate([appConstants.routes.EmployeesBase]);
        },
        error: (err: unknown) => {
          this.logError('loadEmployee', err);
          this.loading = false;
          this.router.navigate([appConstants.routes.EmployeesBase]);
        }
      });
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.defaultImage;
  }

  editEmployee(): void {
    if (this.employee) {
      this.router.navigate([appConstants.routes.EmployeeEdit, this.employee.id]);
    }
  }

  deleteEmployee(): void {
    if (!this.employee) return;

    if (!confirm('Are you sure you want to delete this employee?')) return;

    this.employeeService.deleteEmployee(this.employee.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.router.navigate([appConstants.routes.EmployeesBase]),
        error: (err: unknown) => {
          this.logError('deleteEmployee', err);
          this.toastService.error('Error deleting employee');
        }
      });
  }

  goBack(): void {
    this.router.navigate([appConstants.routes.EmployeesBase]);
  }

  private logError(operation: string, err: unknown): void {
    if (err instanceof Error) {
      console.error(`${operation} failed: ${err.message}`, err);
    } else {
      console.error(`${operation} failed:`, err);
    }
  }
}
