import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Employee, EmployeeDto } from "../models/employee.model";

@Injectable({ providedIn: "root" })
export class EmployeeService {
  private http = inject(HttpClient);
  private apiUrl = "/api/Employees"; // Note the capital 'E'

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }
  addEmployee(employee: EmployeeDto): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }
  updateEmployee(id: number, employee: EmployeeDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, employee);
  }
  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
