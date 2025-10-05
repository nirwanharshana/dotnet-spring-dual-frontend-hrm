export interface Department {
  departmentId: number;
  name: string;
  location: string;
}
export type DepartmentDto = Omit<Department, "departmentId">;
