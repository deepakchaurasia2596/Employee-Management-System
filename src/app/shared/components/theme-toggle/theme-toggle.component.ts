// Angular imports
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Internal imports
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss'
})
export class ThemeToggleComponent {
  constructor(public themeService: ThemeService) {}

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}

