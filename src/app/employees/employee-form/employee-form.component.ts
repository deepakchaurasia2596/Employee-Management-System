import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

// Internal imports
import { EmployeeService } from '../../core/services/employee.service';
import { Department, EmployeeStatus } from '../../core/models/employee.model';
import { CustomValidators } from '../../shared/validators/custom.validators';
import { ImageUploadComponent } from '../../shared/components/image-upload/image-upload.component';
import { FormHelper } from '../../shared/helpers/form.helper';
import { appConstants } from '../../core/constants/app.constants';
import { SfButtonComponent } from '../../shared/components/sf-button/sf-button.component';
import { SfDropdownComponent } from '../../shared/components/sf-dropdown/sf-dropdown.component';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ImageUploadComponent, SfButtonComponent, SfDropdownComponent],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit, OnDestroy {
  employeeForm: FormGroup;
  isEditMode = false;
  employeeId: number | null = null;
  previewUrl: string | null = null;

  // Dropdown Data
  departmentDropdownOptions = [
    { text: 'Select Department', value: '' },
    ...Object.values(Department).map(d => ({ text: d, value: d }))
  ];

  statusDropdownOptions = [
    { text: 'Select Status', value: '' },
    ...Object.values(EmployeeStatus).map(s => ({ text: s, value: s }))
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastrService
  ) {
    this.employeeForm = this.createForm();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.employeeId = +id;
      this.loadEmployee(this.employeeId);
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
      salary: ['', [Validators.required, Validators.min(0)]]
    });
  }

  private loadEmployee(id: number): void {
    this.employeeService.getEmployeeById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: emp => {
          if (!emp) {
            this.router.navigate([appConstants.routes.EmployeesBase]);
            return;
          }
          this.employeeForm.patchValue(emp);
          this.previewUrl = emp.imageUrl ?? null;
        },
        error: () => {
          this.toastService.error('Error loading employee');
          this.router.navigate([appConstants.routes.EmployeesBase]);
        }
      });
  }

  onDepartmentChange(value: string): void {
    this.employeeForm.get('department')?.setValue(value || '');
    this.employeeForm.get('department')?.markAsTouched();
  }

  onStatusChange(value: string): void {
    this.employeeForm.get('status')?.setValue(value || '');
    this.employeeForm.get('status')?.markAsTouched();
  }

  onImageSelected(file: File | null): void {
    this.previewUrl = file ? URL.createObjectURL(file) : null;
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.markFormTouched();
      return;
    }

    const payload = {
      ...this.employeeForm.value,
      imageUrl: this.previewUrl
    };

    const request$ = this.isEditMode && this.employeeId
      ? this.employeeService.updateEmployee(this.employeeId, payload)
      : this.employeeService.addEmployee(payload);

    request$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastService.success(
            this.isEditMode ? 'Employee updated' : 'Employee added'
          );
          this.router.navigate([appConstants.routes.EmployeesBase]);
        },
        error: () => this.toastService.error('Operation failed')
      });
  }

  cancel(): void {
    this.router.navigate([appConstants.routes.EmployeesBase]);
  }

  private markFormTouched(): void {
    Object.values(this.employeeForm.controls).forEach(c => c.markAsTouched());
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
