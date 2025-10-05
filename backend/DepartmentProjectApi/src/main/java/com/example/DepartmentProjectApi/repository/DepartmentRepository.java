package com.example.DepartmentProjectApi.repository;
import com.example.DepartmentProjectApi.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
public interface DepartmentRepository extends JpaRepository<Department, Integer> {}