// Angular imports
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';

// Internal imports
import { AuthService } from './core/services/auth.service';
import { ThemeToggleComponent } from './shared/components/theme-toggle/theme-toggle.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { environment } from '../environments/environment';
import { appConstants } from './core/constants/app.constants';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    ThemeToggleComponent,
    LoadingSpinnerComponent,
    ToastComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  // Data
  readonly productName = environment.productName;
  readonly appConstants = appConstants;

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate([this.appConstants.routes.Login]);
  }
}
