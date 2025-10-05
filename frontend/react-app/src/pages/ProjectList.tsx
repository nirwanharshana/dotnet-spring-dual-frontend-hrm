import { useState, useEffect } from "react";
import { Project, ProjectDto } from "../types/models";
import * as projectService from "../services/projectService";
import { Button, Table, Spinner, Alert, Modal, Form } from "react-bootstrap";
import { ManageProjectEmployeesModal } from "../components/ManageProjectEmployeesModal";
import { toast } from "react-toastify";

export const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for modals
  const [showFormModal, setShowFormModal] = useState(false);
  const [showEmployeesModal, setShowEmployeesModal] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<ProjectDto>({
    projectName: "",
    startDate: "",
    endDate: "",
  });

  const fetchProjects = async () => {
    try {
      !loading && setLoading(true);
      const response = await projectService.getProjects();
      // In a real app, you would also fetch assignment counts here
      setProjects(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // --- Form Modal Handlers ---
  const handleShowFormModal = (project: Project | null = null) => {
    setCurrentProject(project);
    if (project) {
      setFormData({
        projectName: project.projectName,
        startDate: project.startDate.split("T")[0],
        endDate: project.endDate.split("T")[0],
      });
    } else {
      setFormData({ projectName: "", startDate: "", endDate: "" });
    }
    setShowFormModal(true);
  };
  const handleCloseFormModal = () => setShowFormModal(false);

  // --- Employee Management Modal Handlers ---
  const handleShowEmployeesModal = (project: Project) => {
    setCurrentProject(project);
    setShowEmployeesModal(true);
  };
  const handleCloseEmployeesModal = () => setShowEmployeesModal(false);

  // --- Generic Handlers ---
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentProject) {
        await projectService.updateProject(currentProject.projectId, formData);
        toast.success(
          `Project "${formData.projectName}" updated successfully!`
        );
      } else {
        await projectService.addProject(formData);
        toast.success(
          `Project "${formData.projectName}" created successfully!`
        );
      }
      fetchProjects();
      handleCloseFormModal();
    } catch (err) {
      toast.error("Failed to save the project.");
      console.error("Failed to save project", err);
    }
  };

  const handleDelete = async (project: Project) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${project.projectName}"?`
      )
    ) {
      try {
        await projectService.deleteProject(project.projectId);
        toast.success(`Project "${project.projectName}" deleted successfully!`);
        fetchProjects();
      } catch (err) {
        toast.error("Failed to delete the project.");
        console.error("Failed to delete project", err);
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
            Project Management
          </h1>
          <p style={{ color: "var(--text-light)" }}>
            Manage all company projects and employee assignments.
          </p>
        </div>
        <Button
          onClick={() => handleShowFormModal()}
          style={{
            backgroundColor: "var(--primary-orange)",
            borderColor: "var(--primary-orange)",
          }}
        >
          + Add Project
        </Button>
      </div>

      <div className="bg-white rounded-3 shadow-sm">
        <Table responsive="sm" hover>
          <thead style={{ backgroundColor: "#f8fafc" }}>
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Project Name</th>
              <th className="p-3">Start Date</th>
              <th className="p-3">End Date</th>
              <th className="p-3 text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.projectId}>
                <td className="p-3">{p.projectId}</td>
                <td className="p-3 fw-medium">{p.projectName}</td>
                <td className="p-3">
                  {new Date(p.startDate).toLocaleDateString()}
                </td>
                <td className="p-3">
                  {new Date(p.endDate).toLocaleDateString()}
                </td>
                <td className="p-3 text-end">
                  <Button
                    variant="link"
                    style={{ color: "#64748b" }}
                    className="fw-medium me-2"
                    onClick={() => handleShowEmployeesModal(p)}
                  >
                    Manage Employees
                  </Button>
                  <Button
                    variant="link"
                    style={{ color: "var(--text-link-edit)" }}
                    className="fw-medium me-2"
                    onClick={() => handleShowFormModal(p)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="link"
                    style={{ color: "var(--text-link-delete)" }}
                    className="fw-medium"
                    onClick={() => handleDelete(p)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Project Add/Edit Modal */}
      <Modal show={showFormModal} onHide={handleCloseFormModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentProject ? "Edit" : "Add"} Project</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleFormChange}
                required
              />
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

      {/* Manage Project Employees Modal */}
      {currentProject && (
        <ManageProjectEmployeesModal
          show={showEmployeesModal}
          onHide={handleCloseEmployeesModal}
          project={currentProject}
          onSave={fetchProjects}
        />
      )}
    </>
  );
};
