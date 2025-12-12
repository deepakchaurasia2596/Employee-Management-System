import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { EmployeeService } from '../../core/services/employee.service';
import { Department, EmployeeStatus, Employee } from '../../core/models/employee.model';
import { CustomValidators } from '../../shared/validators/custom.validators';
import { ImageUploadComponent } from '../../shared/components/image-upload/image-upload.component';
import { ToastService } from '../../core/services/toast.service';
import { FormHelper } from '../../shared/helpers/form.helper';
import { appConstants } from '../../core/constants/app.constants';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ImageUploadComponent],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit, OnDestroy {
  employeeForm: FormGroup;
  departments = Object.values(Department);
  statuses = Object.values(EmployeeStatus);
  isEditMode = false;
  employeeId: number | null = null;
  previewUrl: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    this.employeeForm = this.createForm();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.employeeId = Number(id);
      this.loadEmployee(Number(id));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, CustomValidators.phoneNumber()]],
      department: ['', Validators.required],
      position: ['', [Validators.required, Validators.minLength(3)]],
      status: [EmployeeStatus.ACTIVE, Validators.required],
      hireDate: ['', [Validators.required, CustomValidators.dateNotFuture()]],
      salary: ['', [Validators.required, Validators.min(0), CustomValidators.salaryRange(30000, 200000)]]
    });
  }

  private loadEmployee(id: number): void {
    this.employeeService.getEmployeeById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (emp) => {
          if (!emp) {
            this.router.navigate([appConstants.routes.EmployeesBase]);
            return;
          }
          this.employeeForm.patchValue(emp);
          if (emp.imageUrl) this.previewUrl = emp.imageUrl;
        },
        error: (err) => {
          console.error('Load employee failed:', err);
          this.toastService.showError('Error loading employee');
            this.router.navigate([appConstants.routes.EmployeesBase]);
        }
      });
  }

  onImageSelected(file: File | null): void {
    if (!file) {
      this.previewUrl = null;
      return;
    }
    this.previewUrl = URL.createObjectURL(file);
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.markFormGroupTouched(this.employeeForm);
      return;
    }

    const payload = {
      ...this.employeeForm.value,
      imageUrl: this.previewUrl
    };

    if (this.isEditMode && this.employeeId) {
      this.employeeService.updateEmployee(this.employeeId, payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
            next: () => {
            this.toastService.showSuccess('Employee updated successfully');
            this.router.navigate([appConstants.routes.EmployeesBase]);
          },
          error: (err) => {
            console.error('Update failed:', err);
            this.toastService.showError('Error updating employee');
          }
        });
    } else {
      this.employeeService.addEmployee(payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
            next: () => {
            this.toastService.showSuccess('Employee added successfully');
            this.router.navigate([appConstants.routes.EmployeesBase]);
          },
          error: (err) => {
            console.error('Add failed:', err);
            this.toastService.showError('Error adding employee');
          }
        });
    }
  }

  cancel(): void {
    this.router.navigate([appConstants.routes.EmployeesBase]);
  }

  private markFormGroupTouched(form: FormGroup): void {
    Object.values(form.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  getError(controlName: string, label: string): string | null {
    return FormHelper.getError(this.employeeForm.get(controlName), label);
  }

  hasError(controlName: string): boolean {
    return FormHelper.hasError(this.employeeForm.get(controlName));
  }

  get(controlName: string): AbstractControl | null {
    return this.employeeForm.get(controlName);
  }
}
