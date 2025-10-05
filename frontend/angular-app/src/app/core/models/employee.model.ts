export interface Employee {
  employeeId: number;
  name: string;
  email: string;
  phone: string;
  salary: number;
  departmentId: number;
  // This property is added on the client-side for display purposes
  departmentName?: string;
}
export type EmployeeDto = Omit<Employee, "employeeId" | "departmentName">;
