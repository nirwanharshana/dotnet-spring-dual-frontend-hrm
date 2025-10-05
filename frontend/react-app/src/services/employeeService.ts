import api from "./api";
import { Employee, EmployeeDto } from "../types/models";

export const getEmployees = () => api.get<Employee[]>("/api/Employees");
export const addEmployee = (emp: EmployeeDto) =>
  api.post<Employee>("/api/Employees", emp);
export const updateEmployee = (id: number, emp: EmployeeDto) =>
  api.put(`/api/Employees/${id}`, emp);
export const deleteEmployee = (id: number) =>
  api.delete(`/api/Employees/${id}`);
