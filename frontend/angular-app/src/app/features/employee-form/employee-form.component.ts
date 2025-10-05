import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Department } from '../../core/models/department.model';
import { Employee } from '../../core/models/employee.model';
import { DepartmentService } from '../../core/services/department.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-employee-form',
  template: `
    <h1 mat-dialog-title class="dialog-title">{{ employee ? 'Edit' : 'Add' }} Employee</h1>
    <div mat-dialog-content>
      <form [formGroup]="form" id="employeeForm" (ngSubmit)="onSave()">
        <mat-form-field appearance="outline">
          <mat-label>Full Name</mat-label>
          <input matInput formControlName="name">
          @if (form.controls.name.hasError('required')) { <mat-error>Name is required</mat-error> }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email">
          @if (form.controls.email.hasError('required')) { <mat-error>Email is required</mat-error> }
          @if (form.controls.email.hasError('email')) { <mat-error>Enter a valid email</mat-error> }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Phone</mat-label>
          <input matInput formControlName="phone">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Salary (LKR)</mat-label>
          <input matInput formControlName="salary" type="number">
          @if (form.controls.salary.hasError('required')) { <mat-error>Salary is required</mat-error> }
          @if (form.controls.salary.hasError('min')) { <mat-error>Salary must be positive</mat-error> }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Department</mat-label>
          <mat-select formControlName="departmentId">
            @if (departments$ | async; as depts) {
              @for (dept of depts; track dept.departmentId) {
                <mat-option [value]="dept.departmentId">{{ dept.name }}</mat-option>
              }
            }
          </mat-select>
          @if (form.controls.departmentId.hasError('required')) { <mat-error>Department is required</mat-error> }
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions align="end" class="dialog-actions">
      <!-- This button simply closes the dialog with no result -->
      <button mat-stroked-button [mat-dialog-close]="undefined">Cancel</button>

      <!-- This button is now explicitly tied to the form's submit action -->
      <button mat-flat-button class="add-button" type="submit" form="employeeForm" [disabled]="form.invalid">
        {{ employee ? 'Save Changes' : 'Create Employee' }}
      </button>
    </div>
  `,
  styles: `
    .dialog-title { font-size: 1.5rem; font-weight: 700; color: var(--app-text-primary); }
    form { display: flex; flex-direction: column; gap: 1rem; padding-top: 1rem; }
    .dialog-actions { padding: 1rem 1.5rem; }
    .add-button { background-color: var(--primary-orange) !important; color: white !important; }
  `,
  imports: [ CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeFormComponent {
  private fb = inject(FormBuilder);
  private departmentService = inject(DepartmentService);
  public dialogRef = inject(MatDialogRef<EmployeeFormComponent>);
  public employee: Employee | null = inject(MAT_DIALOG_DATA, { optional: true });

  departments$: Observable<Department[]> = this.departmentService.getDepartments();

  form = this.fb.group({
    name: [this.employee?.name ?? '', Validators.required],
    email: [this.employee?.email ?? '', [Validators.required, Validators.email]],
    phone: [this.employee?.phone ?? ''],
    salary: [this.employee?.salary ?? null, [Validators.required, Validators.min(0)]],
    departmentId: [this.employee?.departmentId ?? null, Validators.required],
  });

  // Explicit save method
  onSave(): void {
    if (this.form.invalid) {
      return;
    }
    this.dialogRef.close(this.form.value);
  }
}