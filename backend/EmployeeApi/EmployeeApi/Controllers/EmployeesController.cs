using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EmployeeApi.Data;
using EmployeeApi.Models;
using EmployeeApi.Dtos;

namespace EmployeeApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly ApiDbContext _dbContext;

        public EmployeesController(ApiDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
        {
            return await _dbContext.Employees.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(int id)
        {
            var employee = await _dbContext.Employees.FindAsync(id);
            if (employee == null) return NotFound();
            return employee;
        }

        [HttpPost]
        public async Task<ActionResult<Employee>> PostEmployee(CreateEmployeeDto createDto)
        {
            var employee = new Employee
            {
                Name = createDto.Name,
                Email = createDto.Email,
                Phone = createDto.Phone,
                Salary = createDto.Salary,
                DepartmentId = createDto.DepartmentId
            };

            _dbContext.Employees.Add(employee);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEmployee), new { id = employee.EmployeeId }, employee);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmployee(int id, UpdateEmployeeDto updateDto)
        {
            var employee = await _dbContext.Employees.FindAsync(id);
            if (employee == null) return NotFound();

            employee.Name = updateDto.Name;
            employee.Email = updateDto.Email;
            employee.Phone = updateDto.Phone;
            employee.Salary = updateDto.Salary;
            employee.DepartmentId = updateDto.DepartmentId;

            await _dbContext.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var employee = await _dbContext.Employees.FindAsync(id);
            if (employee == null) return NotFound();

            _dbContext.Employees.Remove(employee);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }
    }
}