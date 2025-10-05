# Fullstack HRM Suite: A Full-Stack Microservices Application

This project is a comprehensive Human Resource Management (HRM) system built to demonstrate a modern, polyglot microservices architecture. It features two distinct backend microservices developed with different technologies (ASP.NET Core and Spring Boot) and two independent frontend applications (Angular and React), showcasing seamless integration across a distributed environment.

## ✨ Key Features

*   **Microservices Architecture:** The backend is split into logical domains:
    *   **Employee Service (.NET):** Manages all employee data.
    *   **Organizational Service (Spring Boot):** Manages departments, projects, and the relationships between employees and projects.
*   **Dual Frontend Implementations:** The same user experience is built twice using today's leading frameworks:
    *   **Angular:** A feature-rich client using modern signals and Angular Material.
    *   **React:** A fast, component-based client using Hooks and React-Bootstrap.
*   **Full CRUD Functionality:** Create, Read, Update, and Delete operations for Employees, Departments, and Projects.
*   **Many-to-Many Relationship Management:** A dedicated interface for assigning and un-assigning employees to various projects.
*   **Cross-Origin Communication:** Both frontend applications use a proxy to securely communicate with the backend services during development.

## 🛠️ Technology Stack

| Area      | Technologies                                                                                                                                                                                          |
| :-------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Backend** | ![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core-512BD4?style=for-the-badge&logo=dotnet&logoColor=white) ![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring&logoColor=white) |
| **Frontend**  | ![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white) ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)      |
| **Database**  | ![MS SQL Server](https://img.shields.io/badge/MS_SQL_Server-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white) ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)      |
| **Styling**   | ![Angular Material](https://img.shields.io/badge/Angular_Material-7B1FA2?style=for-the-badge&logo=angular&logoColor=white) ![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)    |

## 🚀 Getting Started

Follow these instructions to get the entire suite running on your local machine.

### Prerequisites

*   **.NET 7+ SDK**
*   **Java 17+ JDK** & **Maven**
*   **Node.js 20+** & npm
*   **Angular CLI** (`npm install -g @angular/cli`)
*   **MS SQL Server** & **MySQL Server**

### 1. Database Setup

The scripts to create and seed the databases are in the `/database` folder.
1.  **MSSQL:** Execute `mssql database.sql` on your SQL Server instance.
2.  **MySQL:** Execute `mysql database.sql` on your MySQL instance.

### 2. Backend Services

#### A. Employee API (.NET)

1.  Navigate to `backend/EmployeeApi`.
2.  In `appsettings.json`, update the `ConnectionStrings.DefaultConnection` with your MSSQL credentials.
3.  Run the application: `dotnet run`
    *   Service will be on `https://localhost:7141`
    *   Swagger UI: `https://localhost:7141/swagger`

#### B. Department & Project API (Spring Boot)

1.  Navigate to `backend/DepartmentProjectApi`.
2.  In `src/main/resources/application.properties`, update your MySQL `username` and `password`.
3.  Run the application: `./mvnw spring-boot:run`
    *   Service will be on `http://localhost:8085`
    *   Swagger UI: `http://localhost:8085/swagger-ui.html`

### 3. Frontend Applications

**Important:** Both backends must be running before starting the frontends.

#### A. Angular App

1.  Navigate to `frontend/angular-app`.
2.  Install dependencies: `npm install`
3.  Start the server: `ng serve`
    *   Application will be available at `http://localhost:4200`

#### B. React App

1.  Navigate to `frontend/react-app`.
2.  Install dependencies: `npm install`
3.  Start the server: `npm run dev`
    *   Application will be available at `http://localhost:3000`

You now have the full system running!