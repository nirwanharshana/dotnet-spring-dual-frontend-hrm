export interface Department {
  departmentId: number;
  name: string;
  location: string;
}

export interface Project {
  projectId: number;
  projectName: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
}

export interface Employee {
  employeeId: number;
  name: string;
  email: string;
  phone: string;
  salary: number;
  departmentId: number;
  // Note: ASP.NET Core might not serialize this by default,
  // so we'll fetch it separately if needed.
  projects?: Project[];
  departmentName?: string; // Client-side property
}

// DTOs for creating/updating
export type DepartmentDto = Omit<Department, "departmentId">;
export type ProjectDto = Omit<Project, "projectId">;
export type EmployeeDto = Omit<
  Employee,
  "employeeId" | "projects" | "departmentName"
>;
