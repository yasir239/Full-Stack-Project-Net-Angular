import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './components/shared/toast/toast.component';
import { LoadingSpinnerComponent } from './components/shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent, LoadingSpinnerComponent],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-gradient-primary shadow-sm">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center gap-2" href="/students">
          <i class="bi bi-mortarboard-fill fs-4"></i>
          <span class="fw-bold">Student Registration</span>
        </a>
        <span class="badge bg-light text-primary fw-semibold">Enterprise Edition</span>
      </div>
    </nav>
    <main class="container py-4">
      <router-outlet></router-outlet>
    </main>
    <app-toast />
    <app-loading-spinner />
    <footer class="text-center py-3 text-muted border-top mt-auto">
      <small>&copy; {{ currentYear }} Student Registration System &mdash; Built with Angular 17 &amp; ASP.NET Core 8</small>
    </footer>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    main { flex: 1; }
    .bg-gradient-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .navbar-brand { letter-spacing: -0.5px; }
  `],
})
export class AppComponent {
  currentYear = new Date().getFullYear();
}
