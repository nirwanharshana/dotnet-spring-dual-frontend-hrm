package com.example.DepartmentProjectApi.controller;

import com.example.DepartmentProjectApi.model.Project;
import com.example.DepartmentProjectApi.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    @Autowired
    private ProjectRepository repo;

    @GetMapping
    public List<Project> getAllProjects() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Integer id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Project createProject(@RequestBody Project project) {
        return repo.save(project);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Integer id, @RequestBody Project projectDetails) {
        return repo.findById(id)
                .map(project -> {
                    project.setProjectName(projectDetails.getProjectName());
                    project.setStartDate(projectDetails.getStartDate());
                    project.setEndDate(projectDetails.getEndDate());
                    return ResponseEntity.ok(repo.save(project));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Integer id) {
        return repo.findById(id)
                .map(project -> {
                    repo.delete(project);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}