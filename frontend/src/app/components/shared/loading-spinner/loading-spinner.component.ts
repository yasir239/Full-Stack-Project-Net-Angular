import { Component, inject } from '@angular/core';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    @if (loadingService.isLoading()) {
      <div class="spinner-overlay">
        <div class="spinner-card">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <span class="mt-2 text-muted fw-medium">Loading...</span>
        </div>
      </div>
    }
  `,
  styles: [`
    .spinner-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.25);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9998;
      animation: fadeIn 0.15s ease-out;
    }
    .spinner-card {
      background: #fff;
      border-radius: 16px;
      padding: 2rem 2.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class LoadingSpinnerComponent {
  loadingService = inject(LoadingService);
}
