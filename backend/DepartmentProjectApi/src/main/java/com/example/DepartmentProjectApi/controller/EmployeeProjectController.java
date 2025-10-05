package com.example.DepartmentProjectApi.controller;

import com.example.DepartmentProjectApi.model.EmployeeProject;
import com.example.DepartmentProjectApi.model.EmployeeProjectId;
import com.example.DepartmentProjectApi.repository.EmployeeProjectRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assignments")
public class EmployeeProjectController {
    @Autowired
    private EmployeeProjectRepository repo;

    @GetMapping("/project/{projectId}")
    public List<EmployeeProject> getAssignmentsByProjectId(@PathVariable Integer projectId) {
        return repo.findAll().stream()
                .filter(assignment -> assignment.getId().getProjectId().equals(projectId))
                .toList();
    }

    @PostMapping("/{employeeId}/{projectId}")
    public ResponseEntity<Void> assignProject(@PathVariable Integer employeeId, @PathVariable Integer projectId) {
        EmployeeProjectId id = new EmployeeProjectId();
        id.setEmployeeId(employeeId);
        id.setProjectId(projectId);

        EmployeeProject assignment = new EmployeeProject();
        assignment.setId(id);

        repo.save(assignment);
        return ResponseEntity.created(null).build();
    }

    @DeleteMapping("/{employeeId}/{projectId}")
    public ResponseEntity<Void> unassignProject(@PathVariable Integer employeeId, @PathVariable Integer projectId) {
        EmployeeProjectId id = new EmployeeProjectId();
        id.setEmployeeId(employeeId);
        id.setProjectId(projectId);
        
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}