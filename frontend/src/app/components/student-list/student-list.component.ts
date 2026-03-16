import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { NotificationService } from '../../services/notification.service';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { Student, StudentQuery, PagedResult } from '../../models/student.model';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [RouterLink, FormsModule, ConfirmDialogComponent],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css',
})
export class StudentListComponent implements OnInit {
  private studentService = inject(StudentService);
  private notification = inject(NotificationService);

  // --- Signals for reactive state ---
  students = signal<Student[]>([]);
  totalCount = signal(0);
  totalPages = signal(0);
  currentPage = signal(1);
  pageSize = signal(10);
  searchTerm = signal('');
  sortBy = signal('studentId');
  sortOrder = signal<'asc' | 'desc'>('asc');
  hasPreviousPage = signal(false);
  hasNextPage = signal(false);

  // Delete confirmation state
  showDeleteDialog = signal(false);
  studentToDelete = signal<Student | null>(null);

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    const query: StudentQuery = {
      page: this.currentPage(),
      pageSize: this.pageSize(),
      search: this.searchTerm() || undefined,
      sortBy: this.sortBy(),
      sortOrder: this.sortOrder(),
    };

    this.studentService.getAll(query).subscribe({
      next: (result: PagedResult<Student>) => {
        this.students.set(result.items);
        this.totalCount.set(result.totalCount);
        this.totalPages.set(result.totalPages);
        this.hasPreviousPage.set(result.hasPreviousPage);
        this.hasNextPage.set(result.hasNextPage);
      },
    });
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.currentPage.set(1);
    this.loadStudents();
  }

  onSort(column: string): void {
    if (this.sortBy() === column) {
      this.sortOrder.set(this.sortOrder() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(column);
      this.sortOrder.set('asc');
    }
    this.loadStudents();
  }

  getSortIcon(column: string): string {
    if (this.sortBy() !== column) return 'bi-chevron-expand';
    return this.sortOrder() === 'asc' ? 'bi-sort-up' : 'bi-sort-down';
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadStudents();
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
    this.loadStudents();
  }

  confirmDelete(student: Student): void {
    this.studentToDelete.set(student);
    this.showDeleteDialog.set(true);
  }

  onDeleteConfirmed(): void {
    const student = this.studentToDelete();
    if (!student) return;

    this.studentService.delete(student.studentId).subscribe({
      next: () => {
        this.notification.success(`Student "${student.studentName}" deleted successfully.`);
        this.showDeleteDialog.set(false);
        this.studentToDelete.set(null);
        this.loadStudents();
      },
    });
  }

  onDeleteCancelled(): void {
    this.showDeleteDialog.set(false);
    this.studentToDelete.set(null);
  }

  getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];
    const maxVisible = 5;

    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}
