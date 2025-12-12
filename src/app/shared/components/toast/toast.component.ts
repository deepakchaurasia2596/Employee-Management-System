// Angular imports
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Internal imports
import { ToastService, Toast } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" aria-live="polite" aria-atomic="true">
      <div *ngFor="let t of toasts" class="toast" [ngClass]="t.type">
        <div class="toast-body">{{ t.message }}</div>
        <button class="toast-close" (click)="dismiss(t.id)" aria-label="Close">✕</button>
      </div>
    </div>
  `,
  styles: [
    `:host { position: fixed; right: 16px; top: 16px; z-index: 1100; }
     .toast-container { display:flex; flex-direction:column; gap:8px; }
     .toast { min-width:200px; max-width:380px; padding:10px 12px; border-radius:6px; color:#fff; box-shadow:0 3px 10px rgba(0,0,0,0.15); display:flex; align-items:center; justify-content:space-between }
     .toast .toast-body { flex:1; padding-right:8px }
     .toast.success { background:#2e7d32 }
     .toast.error { background:#c62828 }
     .toast.info { background:#1565c0 }
     .toast-close { background:transparent; border: none; color: rgba(255,255,255,0.9); font-size:14px; cursor:pointer }
  `]
})
export class ToastComponent implements OnInit {
  toasts: Toast[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.toasts$.subscribe(t => this.toasts = t);
  }

  dismiss(id: number) {
    this.toastService.dismiss(id);
  }
}
