import api from "./api";
import { Department } from "../types/models";

export type DepartmentDto = Omit<Department, "departmentId">;

export const getDepartments = () => api.get<Department[]>("/api/departments");
export const addDepartment = (dept: DepartmentDto) =>
  api.post<Department>("/api/departments", dept);
export const updateDepartment = (id: number, dept: DepartmentDto) =>
  api.put(`/api/departments/${id}`, dept);
export const deleteDepartment = (id: number) =>
  api.delete(`/api/departments/${id}`);
