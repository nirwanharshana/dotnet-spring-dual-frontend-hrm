import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Department, DepartmentDto } from "../models/department.model";

@Injectable({ providedIn: "root" })
export class DepartmentService {
  private http = inject(HttpClient);
  private apiUrl = "/api/departments"; // Handled by proxy

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl);
  }
  addDepartment(department: DepartmentDto): Observable<Department> {
    return this.http.post<Department>(this.apiUrl, department);
  }
  updateDepartment(id: number, department: DepartmentDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, department);
  }
  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
