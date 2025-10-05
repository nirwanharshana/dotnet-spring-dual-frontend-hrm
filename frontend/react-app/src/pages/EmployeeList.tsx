import { useState, useEffect } from "react";
import { Employee, EmployeeDto, Department } from "../types/models";
import * as employeeService from "../services/employeeService";
import * as departmentService from "../services/departmentService";
import { Button, Table, Spinner, Alert, Modal, Form } from "react-bootstrap";
import { toast } from "react-toastify";

export const EmployeeList = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentMap, setDepartmentMap] = useState<Map<number, string>>(
    new Map()
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- State for Modals ---
  const [showFormModal, setShowFormModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<EmployeeDto>({
    name: "",
    email: "",
    phone: "",
    salary: 0,
    departmentId: 0,
  });

  const fetchData = async () => {
    try {
      !loading && setLoading(true);
      const [empResponse, deptResponse] = await Promise.all([
        employeeService.getEmployees(),
        departmentService.getDepartments(),
      ]);

      setEmployees(empResponse.data);
      setDepartments(deptResponse.data);

      const deptMap = new Map<number, string>();
      deptResponse.data.forEach((d) => deptMap.set(d.departmentId, d.name));
      setDepartmentMap(deptMap);
      setError(null);
    } catch (err) {
      setError("Failed to fetch application data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Employee Form Modal Handlers ---
  const handleShowFormModal = (employee: Employee | null = null) => {
    setCurrentEmployee(employee);
    if (employee) {
      setFormData({
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        salary: employee.salary,
        departmentId: employee.departmentId,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        salary: 0,
        departmentId: departments[0]?.departmentId ?? 0,
      });
    }
    setShowFormModal(true);
  };
  const handleCloseFormModal = () => setShowFormModal(false);

  // --- Generic Form & Delete Handlers ---
  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ["salary", "departmentId"].includes(name) ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentEmployee) {
        await employeeService.updateEmployee(
          currentEmployee.employeeId,
          formData
        );
        toast.success(`Employee "${formData.name}" updated!`);
      } else {
        await employeeService.addEmployee(formData);
        toast.success(`Employee "${formData.name}" created!`);
      }
      fetchData();
      handleCloseFormModal();
    } catch (err) {
      toast.error("Failed to save employee.");
      console.error("Failed to save employee", err);
    }
  };

  const handleDelete = async (employee: Employee) => {
    if (window.confirm(`Are you sure you want to delete ${employee.name}?`)) {
      try {
        await employeeService.deleteEmployee(employee.employeeId);
        toast.success(`Employee "${employee.name}" deleted!`);
        fetchData();
      } catch (err) {
        toast.error("Failed to delete employee.");
        console.error("Failed to delete employee", err);
      }
    }
  };

  if (loading)
    return (
      <div className="text-center p-5">
        <Spinner
          animation="border"
          style={{ color: "var(--primary-orange)" }}
        />
      </div>
    );
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 style={{ color: "var(--text-dark)", fontWeight: 700 }}>
            Employee Management
          </h1>
          <p style={{ color: "var(--text-light)" }}>
            Manage all employee records in your organization.
          </p>
        </div>
        <Button
          onClick={() => handleShowFormModal()}
          style={{
            backgroundColor: "var(--primary-orange)",
            borderColor: "var(--primary-orange)",
          }}
        >
          + Add Employee
        </Button>
      </div>

      <div className="bg-white rounded-3 shadow-sm">
        <Table responsive="sm" hover>
          <thead style={{ backgroundColor: "#f8fafc" }}>
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Department</th>
              <th className="p-3 text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.employeeId}>
                <td className="p-3">{emp.employeeId}</td>
                <td className="p-3 fw-medium">{emp.name}</td>
                <td className="p-3">{emp.email}</td>
                <td className="p-3">
                  {departmentMap.get(emp.departmentId) ?? "N/A"}
                </td>
                <td className="p-3 text-end">
                  <Button
                    variant="link"
                    style={{ color: "var(--text-link-edit)" }}
                    className="fw-medium me-2"
                    onClick={() => handleShowFormModal(emp)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="link"
                    style={{ color: "var(--text-link-delete)" }}
                    className="fw-medium"
                    onClick={() => handleDelete(emp)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Employee Add/Edit Modal */}
      <Modal show={showFormModal} onHide={handleCloseFormModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentEmployee ? "Edit" : "Add"} Employee</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Salary (LKR)</Form.Label>
              <Form.Control
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Department</Form.Label>
              <Form.Select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleFormChange}
                required
              >
                {departments.map((d) => (
                  <option key={d.departmentId} value={d.departmentId}>
                    {d.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseFormModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              style={{
                backgroundColor: "var(--primary-orange)",
                borderColor: "var(--primary-orange)",
              }}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};
