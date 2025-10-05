import api from "./api";
import { Project, ProjectDto } from "../types/models";

export const getProjects = () => api.get<Project[]>("/api/projects");
export const addProject = (project: ProjectDto) =>
  api.post<Project>("/api/projects", project);
export const updateProject = (id: number, project: ProjectDto) =>
  api.put(`/api/projects/${id}`, project);
export const deleteProject = (id: number) => api.delete(`/api/projects/${id}`);
