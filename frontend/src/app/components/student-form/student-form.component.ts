import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.css',
})
export class StudentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private studentService = inject(StudentService);
  private notification = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = signal(false);
  studentId = signal<number | null>(null);
  pageTitle = signal('Register New Student');

  studentForm: FormGroup = this.fb.group({
    studentName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    mobileNo: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^\d+$/)]],
    city: ['', [Validators.maxLength(50)]],
    state: ['', [Validators.maxLength(50)]],
    pinCode: ['', [Validators.maxLength(10), Validators.pattern(/^\d*$/)]],
    addressLine1: ['', [Validators.maxLength(200)]],
    addressLine2: ['', [Validators.maxLength(200)]],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.studentId.set(+id);
      this.pageTitle.set('Edit Student');
      this.loadStudent(+id);
    }
  }

  private loadStudent(id: number): void {
    this.studentService.getById(id).subscribe({
      next: (student) => {
        this.studentForm.patchValue({
          studentName: student.studentName,
          email: student.email,
          mobileNo: student.mobileNo,
          city: student.city || '',
          state: student.state || '',
          pinCode: student.pinCode || '',
          addressLine1: student.addressLine1 || '',
          addressLine2: student.addressLine2 || '',
        });
      },
    });
  }

  onSubmit(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    const formData = this.studentForm.value;

    if (this.isEditMode()) {
      this.studentService.update(this.studentId()!, formData).subscribe({
        next: () => {
          this.notification.success('Student updated successfully!');
          this.router.navigate(['/students']);
        },
      });
    } else {
      this.studentService.create(formData).subscribe({
        next: () => {
          this.notification.success('Student registered successfully!');
          this.router.navigate(['/students']);
        },
      });
    }
  }

  // Helper for template
  hasError(field: string, error: string): boolean {
    const control = this.studentForm.get(field);
    return !!control && control.hasError(error) && control.touched;
  }
}
