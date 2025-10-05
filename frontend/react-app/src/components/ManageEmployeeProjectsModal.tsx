import { useState, useEffect } from "react";
import {
  Modal,
  Button,
  ListGroup,
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";
import { Employee, Project } from "../types/models";
import * as projectService from "../services/projectService";
import * as employeeProjectService from "../services/employeeProjectService";
import { toast } from "react-toastify";
import * as employeeService from "../services/employeeService";

interface Props {
  show: boolean;
  onHide: () => void;
  employee: Employee | null;
  onSave: () => void;
}

export const ManageEmployeeProjectsModal = ({
  show,
  onHide,
  employee,
  onSave,
}: Props) => {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [assignedProjectIds, setAssignedProjectIds] = useState<Set<number>>(
    new Set()
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (show && employee) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const projResponse = await projectService.getProjects();
          setAllProjects(projResponse.data);

          const empResponse = await employeeService.getEmployees();
          const currentEmployeeData = empResponse.data.find(
            (e) => e.employeeId === employee.employeeId
          );

          setAssignedProjectIds(
            new Set(
              currentEmployeeData?.projects?.map((p) => p.projectId) ?? []
            )
          );

          setError(null);
        } catch (err) {
          setError("Could not load project data.");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [show, employee]);

  const handleAssign = async (project: Project) => {
    if (!employee) return;
    try {
      await employeeProjectService.assignProject(
        employee.employeeId,
        project.projectId
      );
      setAssignedProjectIds((prev) => new Set(prev).add(project.projectId));
      toast.success(`${project.projectName} assigned to ${employee.name}.`);
    } catch (err) {
      toast.error(`Failed to assign ${project.projectName}.`);
    }
  };

  const handleUnassign = async (project: Project) => {
    if (!employee) return;
    try {
      await employeeProjectService.unassignProject(
        employee.employeeId,
        project.projectId
      );
      setAssignedProjectIds((prev) => {
        const next = new Set(prev);
        next.delete(project.projectId);
        return next;
      });
      toast.info(`${project.projectName} un-assigned from ${employee.name}.`);
    } catch (err) {
      toast.error(`Failed to un-assign ${project.projectName}.`);
    }
  };

  const availableProjects = allProjects.filter(
    (p) => !assignedProjectIds.has(p.projectId)
  );
  const assignedProjects = allProjects.filter((p) =>
    assignedProjectIds.has(p.projectId)
  );

  const handleClose = () => {
    onSave();
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Manage Projects for {employee?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && (
          <div className="text-center">
            <Spinner
              animation="border"
              style={{ color: "var(--primary-orange)" }}
            />
          </div>
        )}
        {error && <Alert variant="danger">{error}</Alert>}
        {!loading && !error && (
          <Row>
            <Col>
              <h5>Available Projects</h5>
              <ListGroup style={{ maxHeight: "300px", overflowY: "auto" }}>
                {availableProjects.map((p) => (
                  <ListGroup.Item
                    key={p.projectId}
                    className="d-flex justify-content-between align-items-center"
                  >
                    {p.projectName}
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleAssign(p)}
                    >
                      +
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
            <Col>
              <h5>Assigned Projects</h5>
              <ListGroup style={{ maxHeight: "300px", overflowY: "auto" }}>
                {assignedProjects.map((p) => (
                  <ListGroup.Item
                    key={p.projectId}
                    className="d-flex justify-content-between align-items-center"
                  >
                    {p.projectName}
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleUnassign(p)}
                    >
                      -
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={handleClose}
          style={{
            backgroundColor: "var(--primary-orange)",
            borderColor: "var(--primary-orange)",
          }}
        >
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
