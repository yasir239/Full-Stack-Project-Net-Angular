import { Component, inject } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999;">
      @for (toast of notificationService.toasts(); track toast.id) {
        <div
          class="toast show align-items-center border-0 shadow-lg mb-2"
          [class]="'toast show align-items-center border-0 shadow-lg mb-2 text-bg-' + toast.type"
          role="alert">
          <div class="d-flex">
            <div class="toast-body d-flex align-items-center gap-2">
              @switch (toast.type) {
                @case ('success') { <i class="bi bi-check-circle-fill"></i> }
                @case ('error') { <i class="bi bi-exclamation-triangle-fill"></i> }
                @case ('warning') { <i class="bi bi-exclamation-circle-fill"></i> }
                @default { <i class="bi bi-info-circle-fill"></i> }
              }
              {{ toast.message }}
            </div>
            <button
              type="button"
              class="btn-close btn-close-white me-2 m-auto"
              (click)="notificationService.dismiss(toast.id)">
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast {
      animation: slideIn 0.3s ease-out;
      min-width: 320px;
      border-radius: 12px;
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .text-bg-success { background: linear-gradient(135deg, #22c55e, #16a34a) !important; }
    .text-bg-error { background: linear-gradient(135deg, #ef4444, #dc2626) !important; color: #fff; }
    .text-bg-warning { background: linear-gradient(135deg, #f59e0b, #d97706) !important; }
    .text-bg-info { background: linear-gradient(135deg, #3b82f6, #2563eb) !important; color: #fff; }
  `]
})
export class ToastComponent {
  notificationService = inject(NotificationService);
}
