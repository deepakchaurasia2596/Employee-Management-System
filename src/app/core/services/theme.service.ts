import { Injectable } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'theme';
  private _theme: Theme = this.getInitialTheme();

  constructor() {
    this.applyTheme(this._theme);
  }

  get theme(): Theme {
    return this._theme;
  }

  toggleTheme(): void {
    this._theme = this._theme === 'light' ? 'dark' : 'light';
    this.applyTheme(this._theme);
    localStorage.setItem(this.STORAGE_KEY, this._theme);
  }

  setTheme(theme: Theme): void {
    this._theme = theme;
    this.applyTheme(theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
  }

  private getInitialTheme(): Theme {
    const stored = localStorage.getItem(this.STORAGE_KEY) as Theme;
    if (stored && (stored === 'light' || stored === 'dark')) {
      return stored;
    }
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  private applyTheme(theme: Theme): void {
    const htmlElement = document.documentElement;
    if (theme === 'dark') {
      htmlElement.classList.add('dark-theme');
      htmlElement.classList.remove('light-theme');
    } else {
      htmlElement.classList.add('light-theme');
      htmlElement.classList.remove('dark-theme');
    }
  }
}
