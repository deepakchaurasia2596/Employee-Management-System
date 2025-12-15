// Angular imports
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

// Internal imports
import { AuthService } from '../../core/services/auth.service';
import { FormHelper } from '../../shared/helpers/form.helper';
import { appConstants } from '../../core/constants/app.constants';
import { SfButtonComponent } from './../../shared/components/sf-button/sf-button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule , SfButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  returnUrl: string = appConstants.routes.EmployeesBase;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastrService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || appConstants.routes.EmployeesBase;
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
        next: () => {
        this.toastService.success('Login successful');
        this.router.navigate([this.returnUrl]);
      },
      error: () => {
        this.toastService.error('Invalid username or password');
      }
    });
  }

  markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }

  getError(controlName: string, label: string): string | null {
    return FormHelper.getError(this.loginForm.get(controlName), label);
  }

  hasError(controlName: string): boolean {
    return FormHelper.hasError(this.loginForm.get(controlName));
  }
}
