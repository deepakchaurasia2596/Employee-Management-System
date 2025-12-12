import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
  duration?: number; // ms
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  private nextId = 1;

  private get toasts(): Toast[] {
    return this.toastsSubject.getValue();
  }

  private set toasts(val: Toast[]) {
    this.toastsSubject.next(val);
  }

  show(message: string, type: ToastType = 'info', duration = 4000) {
    const toast: Toast = { id: this.nextId++, type, message, duration };
    this.toasts = [...this.toasts, toast];

    if (duration && duration > 0) {
      setTimeout(() => this.dismiss(toast.id), duration);
    }
    return toast.id;
  }

  showSuccess(message: string, duration = 4000) {
    return this.show(message, 'success', duration);
  }

  showError(message: string, duration = 6000) {
    return this.show(message, 'error', duration);
  }

  showInfo(message: string, duration = 4000) {
    return this.show(message, 'info', duration);
  }

  dismiss(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  clear() {
    this.toasts = [];
  }
}
