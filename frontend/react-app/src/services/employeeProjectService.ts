import api from "./api";

// This interface defines the shape of the data from the new backend endpoint
interface EmployeeProjectAssignment {
  id: {
    employeeId: number;
    projectId: number;
  };
}

export const assignProject = (employeeId: number, projectId: number) =>
  api.post(`/api/assignments/${employeeId}/${projectId}`);

export const unassignProject = (employeeId: number, projectId: number) =>
  api.delete(`/api/assignments/${employeeId}/${projectId}`);

// The new function to get all assignments for a single project
export const getAssignmentsByProject = (projectId: number) =>
  api.get<EmployeeProjectAssignment[]>(`/api/assignments/project/${projectId}`);
