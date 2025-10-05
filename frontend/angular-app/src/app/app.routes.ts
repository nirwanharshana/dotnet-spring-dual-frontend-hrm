import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "employees",
    loadComponent: () =>
      import("./features/employee-list/employee-list.component").then(
        (c) => c.EmployeeListComponent
      ),
    title: "Employee Management",
  },
  {
    path: "departments",
    loadComponent: () =>
      import("./features/department-list/department-list.component").then(
        (c) => c.DepartmentListComponent
      ),
    title: "Department Management",
  },
  { path: "", redirectTo: "/employees", pathMatch: "full" },
  { path: "**", redirectTo: "/employees" },
];
