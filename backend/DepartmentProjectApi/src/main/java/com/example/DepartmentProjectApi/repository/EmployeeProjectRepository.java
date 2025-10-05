package com.example.DepartmentProjectApi.repository;
import com.example.DepartmentProjectApi.model.EmployeeProject;
import com.example.DepartmentProjectApi.model.EmployeeProjectId;
import org.springframework.data.jpa.repository.JpaRepository;
public interface EmployeeProjectRepository extends JpaRepository<EmployeeProject, EmployeeProjectId> {}