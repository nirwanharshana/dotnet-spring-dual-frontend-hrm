-- =================================================================
-- Script for DepartmentProjectApi Database (MySQL)
-- Database: org_db
-- =================================================================

-- Step 1: Create the database
CREATE DATABASE IF NOT EXISTS org_db;
USE org_db;

-- Step 2: Create the tables
CREATE TABLE IF NOT EXISTS department (
    department_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    PRIMARY KEY (department_id)
);

CREATE TABLE IF NOT EXISTS project (
    project_id INT NOT NULL AUTO_INCREMENT,
    project_name VARCHAR(150) NOT NULL,
    start_date DATE,
    end_date DATE,
    PRIMARY KEY (project_id)
);

CREATE TABLE IF NOT EXISTS employee_project (
    employee_id INT NOT NULL, -- References Employee in the other service
    project_id INT NOT NULL,
    PRIMARY KEY (employee_id, project_id)
);

-- Step 3: Insert 10 sample records into each table
-- Clear tables to prevent duplicates on re-run
TRUNCATE TABLE department;
INSERT INTO department (name, location) VALUES
('Information Technology', 'Colombo'),
('Human Resources', 'Kandy'),
('Finance', 'Galle'),
('Marketing', 'Jaffna'),
('Operations', 'Colombo'),
('Quality Assurance', 'Negombo'),
('Customer Support', 'Matara'),
('Research & Development', 'Kurunegala'),
('Administration', 'Colombo'),
('Legal', 'Kandy');

TRUNCATE TABLE project;
INSERT INTO project (project_name, start_date, end_date) VALUES
('Project Phoenix', '2025-01-10', '2025-06-30'),
('Project Dragon', '2025-02-15', '2025-08-20'),
('Project Gamma', '2025-03-01', '2025-12-15'),
('Project Delta', '2025-04-20', '2025-09-30'),
('Project Omega', '2025-05-05', '2026-01-10'),
('Project Titan', '2025-06-12', '2026-03-25'),
('Project Neptune', '2025-07-01', '2025-11-01'),
('Project Orion', '2025-08-22', '2026-04-18'),
('Project Vega', '2025-09-01', '2026-05-30'),
('Project Sierra', '2025-10-15', '2026-07-22');

TRUNCATE TABLE employee_project;
INSERT INTO employee_project (employee_id, project_id) VALUES
-- Assigning employees to various projects
(1, 1), (1, 3),
(2, 1), (2, 4),
(3, 2),
(4, 5), (4, 6),
(5, 7), (5, 3),
(6, 8),
(7, 9), (7, 10),
(8, 1), (8, 5), (8, 9),
(9, 2),
(10, 4), (10, 8);

SELECT 'MySQL org_db database and tables created with 10 sample records.' AS 'Status';