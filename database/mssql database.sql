-- =================================================================
-- Script for EmployeeApi Database (Microsoft SQL Server)
-- Database: EmployeeOnlyDB
-- =================================================================

-- Step 1: Create the database if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'EmployeeOnlyDB')
BEGIN
    CREATE DATABASE EmployeeOnlyDB;
END
GO

-- Step 2: Use the created database
USE EmployeeOnlyDB;
GO

-- Step 3: Create the Employees table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Employees' AND xtype='U')
BEGIN
    CREATE TABLE Employees (
        EmployeeId INT PRIMARY KEY IDENTITY(1,1),
        Name NVARCHAR(100) NOT NULL,
        Email NVARCHAR(100) UNIQUE NOT NULL,
        Phone NVARCHAR(20),
        Salary DECIMAL(18, 2) NOT NULL,
        DepartmentId INT NOT NULL -- This references the department in the other service
    );
END
GO

-- Step 4: Insert 10 sample employee records
-- This TRUNCATE statement clears the table to avoid duplicates on re-running the script
TRUNCATE TABLE Employees;
GO

INSERT INTO Employees (Name, Email, Phone, Salary, DepartmentId) VALUES
('Nimali Perera', 'nimali.p@example.com', '0771234567', 90000.00, 1),   -- Department 1: IT
('Saman Kumara', 'saman.k@example.com', '0712345678', 110000.00, 1),  -- Department 1: IT
('Anusha Silva', 'anusha.s@example.com', '0765432109', 75000.00, 2),   -- Department 2: HR
('Dasun Jayasinghe', 'dasun.j@example.com', '0723456789', 150000.00, 1),  -- Department 1: IT
('Priya Fernando', 'priya.f@example.com', '0789012345', 82000.00, 3),   -- Department 3: Finance
('Kasun Rathnayake', 'kasun.r@example.com', '0756789012', 68000.00, 4),   -- Department 4: Marketing
('Ishara Bandara', 'ishara.b@example.com', '0701112233', 95000.00, 3),   -- Department 3: Finance
('Lahiru Madushan', 'lahiru.m@example.com', '0778899001', 125000.00, 1),  -- Department 1: IT
('Chamari Atapattu', 'chamari.a@example.com', '0761239876', 78000.00, 2),   -- Department 2: HR
('Ruwan Costa', 'ruwan.c@example.com', '0719876543', 92000.00, 4);      -- Department 4: Marketing
GO

PRINT 'MSSQL EmployeeOnlyDB database and table created with 10 sample records.';
GO