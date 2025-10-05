import { useState, useEffect } from "react";
import { Department, DepartmentDto } from "../types/models";
import * as departmentService from "../services/departmentService";
import { Button, Table, Spinner, Alert, Modal, Form } from "react-bootstrap";
import { toast } from "react-toastify";

export const DepartmentList = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal and Form State
  const [showModal, setShowModal] = useState(false);
  const [currentDept, setCurrentDept] = useState<Department | null>(null);
  const [formData, setFormData] = useState<DepartmentDto>({
    name: "",
    location: "",
  });

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await departmentService.getDepartments();
      setDepartments(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch departments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleShowModal = (dept: Department | null = null) => {
    setCurrentDept(dept);
    setFormData(
      dept
        ? { name: dept.name, location: dept.location }
        : { name: "", location: "" }
    );
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentDept) {
        await departmentService.updateDepartment(
          currentDept.departmentId,
          formData
        );
        toast.success(`Department "${formData.name}" updated!`);
      } else {
        await departmentService.addDepartment(formData);
        toast.success(`Department "${formData.name}" created!`);
      }
      fetchDepartments();
      handleCloseModal();
    } catch (err) {
      toast.error("Failed to save department.");
      console.error("Failed to save department", err);
    }
  };

  const handleDelete = async (dept: Department) => {
    if (window.confirm(`Are you sure you want to delete "${dept.name}"?`)) {
      try {
        await departmentService.deleteDepartment(dept.departmentId);
        toast.success(`Department "${dept.name}" deleted!`);
        fetchDepartments();
      } catch (err) {
        toast.error("Failed to delete department.");
        console.error("Failed to delete department", err);
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
            Department Management
          </h1>
          <p style={{ color: "var(--text-light)" }}>
            Manage all organizational departments.
          </p>
        </div>
        <Button
          onClick={() => handleShowModal()}
          style={{
            backgroundColor: "var(--primary-orange)",
            borderColor: "var(--primary-orange)",
          }}
        >
          + Add Department
        </Button>
      </div>

      <div className="bg-white rounded-3 shadow-sm">
        <Table responsive="sm" hover>
          <thead style={{ backgroundColor: "#f8fafc" }}>
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Location</th>
              <th className="p-3 text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.departmentId}>
                <td className="p-3">{dept.departmentId}</td>
                <td className="p-3 fw-medium">{dept.name}</td>
                <td className="p-3">{dept.location}</td>
                <td className="p-3 text-end">
                  <Button
                    variant="link"
                    style={{ color: "var(--text-link-edit)" }}
                    className="fw-medium me-2"
                    onClick={() => handleShowModal(dept)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="link"
                    style={{ color: "var(--text-link-delete)" }}
                    className="fw-medium"
                    onClick={() => handleDelete(dept)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentDept ? "Edit" : "Add"} Department</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Department Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
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
