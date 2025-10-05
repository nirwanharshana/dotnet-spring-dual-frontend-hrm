package com.example.DepartmentProjectApi.repository;
import com.example.DepartmentProjectApi.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ProjectRepository extends JpaRepository<Project, Integer> {}