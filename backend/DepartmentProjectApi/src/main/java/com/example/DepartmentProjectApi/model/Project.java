package com.example.DepartmentProjectApi.model;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDate;
@Entity
public class Project {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Integer projectId;
private String projectName;
private LocalDate startDate;
private LocalDate endDate;
// Getters and Setters
public Integer getProjectId() {
    return projectId;
}

public void setProjectId(Integer projectId) {
    this.projectId = projectId;
}

public String getProjectName() {
    return projectName;
}

public void setProjectName(String projectName) {
    this.projectName = projectName;
}

public LocalDate getStartDate() {
    return startDate;
}

public void setStartDate(LocalDate startDate) {
    this.startDate = startDate;
}

public LocalDate getEndDate() {
    return endDate;
}

public void setEndDate(LocalDate endDate) {
    this.endDate = endDate;
}
}