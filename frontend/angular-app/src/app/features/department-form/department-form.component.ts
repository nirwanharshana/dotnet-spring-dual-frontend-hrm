import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Department } from '../../core/models/department.model';

@Component({
  selector: 'app-department-form',
  template: `
    <h1 mat-dialog-title class="dialog-title">{{ department ? 'Edit' : 'Add' }} Department</h1>
    <div mat-dialog-content>
      <form [formGroup]="form" id="departmentForm" (ngSubmit)="onSave()">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" placeholder="e.g., Engineering">
          @if (form.controls.name.hasError('required')) {
            <mat-error>Name is required</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Location</mat-label>
          <input matInput formControlName="location" placeholder="e.g., Colombo Office">
           @if (form.controls.location.hasError('required')) {
            <mat-error>Location is required</mat-error>
          }
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions align="end" class="dialog-actions">
      <!-- This button simply closes the dialog with no result -->
      <button mat-stroked-button [mat-dialog-close]="undefined">Cancel</button>

      <!-- This button is now explicitly tied to the form's submit action -->
      <button mat-flat-button class="add-button" type="submit" form="departmentForm" [disabled]="form.invalid">
        {{ department ? 'Save Changes' : 'Create Department' }}
      </button>
    </div>
  `,
  styles: `
    .dialog-title { 
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--app-text-primary); 
    }
    form { 
      display: flex; 
      flex-direction: column; 
      gap: 1rem; 
      padding-top: 1rem; 
    }
    mat-form-field { 
      width: 100%; 
    }
    .dialog-actions {
      padding: 1rem 1.5rem;
    }
    .add-button {
      background-color: var(--primary-orange) !important;
      color: white !important;
    }
  `,
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentFormComponent {
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<DepartmentFormComponent>);
  public department: Department | null = inject(MAT_DIALOG_DATA, { optional: true });

  form = this.fb.group({
    name: [this.department?.name ?? '', Validators.required],
    location: [this.department?.location ?? '', Validators.required],
  });

  // Explicit save method
  onSave(): void {
    if (this.form.invalid) {
      return; // Do nothing if the form is invalid
    }
    // Close the dialog and pass the valid form data back
    this.dialogRef.close(this.form.value);
  }
}