import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { DepartmentService } from "../../core/services/department.service";
import { Department, DepartmentDto } from "../../core/models/department.model";
import { MatDialog } from "@angular/material/dialog";
import { DepartmentFormComponent } from "../department-form/department-form.component";

// Material Imports
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";

type State = {
  departments: Department[];
  loading: boolean;
  error: string | null;
};

@Component({
  selector: "app-department-list",
  template: `
    <div class="relative">
      <!-- Header -->
      <div class="header-container">
        <div>
          <h1 class="header-title">Department Management</h1>
          <p class="header-subtitle">Manage all organizational departments.</p>
        </div>
        <button mat-flat-button class="add-button" (click)="onAdd()">
          <mat-icon>add</mat-icon>
          <span>Add Department</span>
        </button>
      </div>

      <!-- Table -->
      <div class="table-container">
        @switch (status()) { @case ('loading') {
        <div class="state-container">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
        } @case ('error') {
        <div class="state-container">{{ state().error }}</div>
        } @case ('success') {
        <table mat-table [dataSource]="state().departments">
          <ng-container matColumnDef="departmentId">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let row">{{ row.departmentId }}</td>
          </ng-container>
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let row" class="font-medium">
              {{ row.name }}
            </td>
          </ng-container>
          <ng-container matColumnDef="location">
            <th mat-header-cell *matHeaderCellDef>Location</th>
            <td mat-cell *matCellDef="let row">{{ row.location }}</td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef class="text-center">
              Actions
            </th>
            <td mat-cell *matCellDef="let row" class="text-center">
              <button class="action-btn edit-btn" (click)="onEdit(row)">
                Edit
              </button>
              <button class="action-btn delete-btn" (click)="onDelete(row)">
                Delete
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr
            mat-row
            *matRowDef="let row; columns: displayedColumns"
            class="table-row"
          ></tr>
        </table>
        @if (state().departments.length === 0 && !state().loading) {
        <div class="state-container">No departments found.</div>
        } } }
      </div>
    </div>
  `,
  // Styles are identical to Employee list for consistency
  styles: `
    :host { display: block; }
    .header-container { margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; }
    .header-title { font-size: 1.5rem; font-weight: 700; color: var(--text-dark); }
    .header-subtitle { font-size: 0.875rem; color: var(--text-light); }
    .add-button { background-color: var(--primary-orange); color: white; }
    .add-button:hover { background-color: var(--primary-orange-hover); }
    .table-container { background-color: var(--surface-bg); border-radius: 0.5rem; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1); overflow: hidden; }
    .mat-mdc-header-cell { background-color: var(--page-bg); color: var(--text-dark); font-weight: 600; text-transform: uppercase; font-size: 0.75rem; }
    .table-row:hover { background-color: #f8fafc; }
    .font-medium { font-weight: 500; }
    .text-center { text-align: center; }
    .action-btn { background: none; border: none; cursor: pointer; font-weight: 500; margin: 0 0.5rem; }
    .edit-btn { color: var(--text-link-edit); }
    .delete-btn { color: var(--text-link-delete); }
    .state-container { padding: 2rem; text-align: center; color: var(--text-light); }
  `,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentListComponent {
  private departmentService = inject(DepartmentService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  state = signal<State>({ departments: [], loading: true, error: null });
  status = computed(() => {
    if (this.state().loading) return "loading";
    if (this.state().error) return "error";
    return "success";
  });

  displayedColumns = ["departmentId", "name", "location", "actions"];

  constructor() {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.state.update((s) => ({ ...s, loading: true }));
    this.departmentService.getDepartments().subscribe({
      next: (depts) =>
        this.state.set({ departments: depts, loading: false, error: null }),
      error: (err) =>
        this.state.set({
          departments: [],
          loading: false,
          error: "Could not load departments.",
        }),
    });
  }

  onAdd(): void {
    const dialogRef = this.dialog.open(DepartmentFormComponent, {
      width: "400px",
    });
    dialogRef.afterClosed().subscribe((result: DepartmentDto | undefined) => {
      if (result) {
        this.departmentService.addDepartment(result).subscribe(() => {
          this.snackBar.open("Department added!", "OK", { duration: 3000 });
          this.loadDepartments();
        });
      }
    });
  }

  onEdit(department: Department): void {
    const dialogRef = this.dialog.open(DepartmentFormComponent, {
      width: "400px",
      data: department,
    });
    dialogRef.afterClosed().subscribe((result: DepartmentDto | undefined) => {
      if (result) {
        this.departmentService
          .updateDepartment(department.departmentId, result)
          .subscribe(() => {
            this.snackBar.open("Department updated!", "OK", { duration: 3000 });
            this.loadDepartments();
          });
      }
    });
  }

  onDelete(department: Department): void {
    if (confirm(`Are you sure you want to delete "${department.name}"?`)) {
      this.departmentService
        .deleteDepartment(department.departmentId)
        .subscribe(() => {
          this.snackBar.open("Department deleted!", "OK", { duration: 3000 });
          this.loadDepartments();
        });
    }
  }
}
