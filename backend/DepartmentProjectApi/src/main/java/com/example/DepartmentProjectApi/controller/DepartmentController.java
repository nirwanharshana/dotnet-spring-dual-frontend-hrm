package com.example.DepartmentProjectApi.controller;

import com.example.DepartmentProjectApi.model.Department;
import com.example.DepartmentProjectApi.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {
    @Autowired
    private DepartmentRepository repo;

    @GetMapping
    public List<Department> getAllDepartments() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Department> getDepartmentById(@PathVariable Integer id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Department createDepartment(@RequestBody Department department) {
        return repo.save(department);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Department> updateDepartment(@PathVariable Integer id, @RequestBody Department departmentDetails) {
        return repo.findById(id)
                .map(department -> {
                    department.setName(departmentDetails.getName());
                    department.setLocation(departmentDetails.getLocation());
                    return ResponseEntity.ok(repo.save(department));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable Integer id) {
        return repo.findById(id)
                .map(department -> {
                    repo.delete(department);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}