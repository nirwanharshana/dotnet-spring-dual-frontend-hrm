import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { CommonModule, TitleCasePipe, CurrencyPipe } from "@angular/common";
import { forkJoin, map } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";

// Models and Services
import { EmployeeService } from "../../core/services/employee.service";
import { DepartmentService } from "../../core/services/department.service";
import { Employee, EmployeeDto } from "../../core/models/employee.model";
import { EmployeeFormComponent } from "../employee-form/employee-form.component";

// Material Imports
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

type State = { employees: Employee[]; loading: boolean; error: string | null };

@Component({
  selector: "app-employee-list",
  template: `
    <div class="relative">
      <!-- Header -->
      <div class="header-container">
        <div>
          <h1 class="header-title">Employee Management Portal</h1>
          <p class="header-subtitle">
            Manage all employee records in your organization.
          </p>
        </div>
        <button mat-flat-button class="add-button" (click)="onAdd()">
          <mat-icon>add</mat-icon>
          <span>Add Employee</span>
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
        <table mat-table [dataSource]="state().employees">
          <ng-container matColumnDef="employeeId">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let row">{{ row.employeeId }}</td>
          </ng-container>
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let row" class="font-medium">
              {{ row.name | titlecase }}
            </td>
          </ng-container>
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let row">{{ row.email }}</td>
          </ng-container>
          <ng-container matColumnDef="department">
            <th mat-header-cell *matHeaderCellDef>Department</th>
            <td mat-cell *matCellDef="let row">{{ row.departmentName }}</td>
          </ng-container>
          <ng-container matColumnDef="salary">
            <th mat-header-cell *matHeaderCellDef class="text-right">Salary</th>
            <td mat-cell *matCellDef="let row" class="text-right font-mono">
              {{ row.salary | currency: "LKR " }}
            </td>
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
        @if (state().employees.length === 0 && !state().loading) {
        <div class="state-container">No employees found.</div>
        } } }
      </div>
    </div>
  `,
  styles: `
    .header-container { 
      margin-bottom: 1.5rem; 
      display: flex; 
      align-items: center; 
      justify-content: space-between;
    }
    .header-title { font-size: 1.5rem; font-weight: 700; color: var(--text-dark); }
    .header-subtitle { font-size: 0.875rem; color: var(--text-light); }
    .add-button {
      background-color: var(--primary-orange);
      color: white;
    }
    .add-button:hover {
      background-color: var(--primary-orange-hover);
    }
    .table-container {
      background-color: var(--surface-bg);
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
      overflow: hidden;
    }
    .mat-mdc-header-cell {
      background-color: var(--page-bg);
      color: var(--text-dark);
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.75rem;
    }
    .table-row:hover { background-color: #f8fafc; }
    .font-medium { font-weight: 500; }
    .font-mono { font-family: monospace; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .action-btn { 
      background: none; 
      border: none; 
      cursor: pointer; 
      font-weight: 500;
      margin: 0 0.5rem;
    }
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeListComponent {
  private employeeService = inject(EmployeeService);
  private departmentService = inject(DepartmentService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  state = signal<State>({ employees: [], loading: true, error: null });
  status = computed(() => {
    if (this.state().loading) return "loading";
    if (this.state().error) return "error";
    return "success";
  });

  displayedColumns = [
    "employeeId",
    "name",
    "email",
    "department",
    "salary",
    "actions",
  ];

  constructor() {
    this.loadData();
  }

  loadData(): void {
    this.state.update((s) => ({ ...s, loading: true }));
    forkJoin({
      employees: this.employeeService.getEmployees(),
      departments: this.departmentService.getDepartments(),
    })
      .pipe(
        map(({ employees, departments }) => {
          const deptMap = new Map(
            departments.map((d) => [d.departmentId, d.name])
          );
          return employees.map((e) => ({
            ...e,
            departmentName: deptMap.get(e.departmentId) ?? "N/A",
          }));
        })
      )
      .subscribe({
        next: (employees) =>
          this.state.set({ employees, loading: false, error: null }),
        error: (err) =>
          this.state.set({
            employees: [],
            loading: false,
            error: "Could not load employee data.",
          }),
      });
  }

  onAdd(): void {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      width: "450px",
    });
    dialogRef.afterClosed().subscribe((result: EmployeeDto | undefined) => {
      if (result) {
        this.employeeService.addEmployee(result).subscribe(() => {
          this.snackBar.open("Employee added successfully!", "OK", {
            duration: 3000,
          });
          this.loadData();
        });
      }
    });
  }

  onEdit(employee: Employee): void {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      width: "450px",
      data: employee,
    });
    dialogRef.afterClosed().subscribe((result: EmployeeDto | undefined) => {
      if (result) {
        this.employeeService
          .updateEmployee(employee.employeeId, result)
          .subscribe(() => {
            this.snackBar.open("Employee updated successfully!", "OK", {
              duration: 3000,
            });
            this.loadData();
          });
      }
    });
  }

  onDelete(employee: Employee): void {
    if (confirm(`Are you sure you want to delete ${employee.name}?`)) {
      this.employeeService.deleteEmployee(employee.employeeId).subscribe(() => {
        this.snackBar.open("Employee deleted successfully!", "OK", {
          duration: 3000,
        });
        this.loadData();
      });
    }
  }
}
