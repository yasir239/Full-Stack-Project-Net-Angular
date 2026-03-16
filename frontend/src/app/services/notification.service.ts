import { Injectable, signal } from '@angular/core';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  id: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private nextId = 0;
  toasts = signal<Toast[]>([]);

  show(message: string, type: Toast['type'] = 'info', duration = 4000): void {
    const id = this.nextId++;
    this.toasts.update((current) => [...current, { message, type, id }]);

    setTimeout(() => this.dismiss(id), duration);
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error', 6000);
  }

  dismiss(id: number): void {
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }
}
