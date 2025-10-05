using System.ComponentModel.DataAnnotations;
namespace EmployeeApi.Dtos
{
    public class UpdateEmployeeDto
    {
        [Required]
        public string Name { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        public string Phone { get; set; }
        [Required]
        [Range(1, double.MaxValue)]
        public decimal Salary { get; set; }
        [Required]
        public int DepartmentId { get; set; }
    }
}