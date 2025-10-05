package com.example.DepartmentProjectApi.model;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;

@Entity
public class EmployeeProject {
    @EmbeddedId
    private EmployeeProjectId id;

    // Getters and Setters
    public EmployeeProjectId getId() {
        return id;
    }

    public void setId(EmployeeProjectId id) {
        this.id = id;
    }
}