namespace EmployeeApi.Models
{
    public class Employee
    {
        public int EmployeeId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public decimal Salary { get; set; }

        // This ID refers to a department in the other microservice.
        // There is no database-level foreign key constraint here.
        public int DepartmentId { get; set; }
    }
}