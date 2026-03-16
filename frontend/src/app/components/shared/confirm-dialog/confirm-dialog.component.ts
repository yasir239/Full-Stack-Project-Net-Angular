import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    @if (isOpen()) {
      <div class="modal-backdrop fade show" (click)="onCancel()"></div>
      <div class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow-lg" style="border-radius: 16px;">
            <div class="modal-header border-0 pb-0">
              <h5 class="modal-title fw-bold d-flex align-items-center gap-2">
                <i class="bi bi-exclamation-triangle-fill text-warning"></i>
                {{ title() }}
              </h5>
              <button type="button" class="btn-close" (click)="onCancel()"></button>
            </div>
            <div class="modal-body text-muted">
              {{ message() }}
            </div>
            <div class="modal-footer border-0 pt-0">
              <button class="btn btn-light px-4" style="border-radius: 10px;" (click)="onCancel()">Cancel</button>
              <button class="btn btn-danger px-4" style="border-radius: 10px;" (click)="onConfirm()">
                <i class="bi bi-trash3 me-1"></i> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop { z-index: 1050; }
    .modal { z-index: 1055; }
    .modal-content { animation: scaleIn 0.2s ease-out; }
    @keyframes scaleIn {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `]
})
export class ConfirmDialogComponent {
  isOpen = input(false);
  title = input('Confirm Delete');
  message = input('Are you sure you want to delete this item? This action cannot be undone.');
  confirmed = output<void>();
  cancelled = output<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
