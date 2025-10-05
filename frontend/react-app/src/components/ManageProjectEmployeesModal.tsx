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
import * as employeeService from "../services/employeeService";
import * as employeeProjectService from "../services/employeeProjectService";

// This is a new service call we need to define
import { getAssignmentsByProject } from "../services/employeeProjectService";

interface Props {
  show: boolean;
  onHide: () => void;
  project: Project | null;
  onSave: () => void;
}

export const ManageProjectEmployeesModal = ({
  show,
  onHide,
  project,
  onSave,
}: Props) => {
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [assignedEmployeeIds, setAssignedEmployeeIds] = useState<Set<number>>(
    new Set()
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (show && project) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const [employeesRes, assignmentsRes] = await Promise.all([
            employeeService.getEmployees(),
            getAssignmentsByProject(project.projectId), // The new API call
          ]);
          setAllEmployees(employeesRes.data);
          setAssignedEmployeeIds(
            new Set(assignmentsRes.data.map((a) => a.id.employeeId))
          );
          setError(null);
        } catch (err) {
          setError("Could not load employee data.");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [show, project]);

  const handleAssign = async (employeeId: number) => {
    if (!project) return;
    await employeeProjectService.assignProject(employeeId, project.projectId);
    setAssignedEmployeeIds((prev) => new Set(prev).add(employeeId));
  };

  const handleUnassign = async (employeeId: number) => {
    if (!project) return;
    await employeeProjectService.unassignProject(employeeId, project.projectId);
    setAssignedEmployeeIds((prev) => {
      const next = new Set(prev);
      next.delete(employeeId);
      return next;
    });
  };

  const availableEmployees = allEmployees.filter(
    (e) => !assignedEmployeeIds.has(e.employeeId)
  );
  const assignedEmployees = allEmployees.filter((e) =>
    assignedEmployeeIds.has(e.employeeId)
  );

  const handleClose = () => {
    onSave();
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Manage Employees for {project?.projectName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        )}
        {error && <Alert variant="danger">{error}</Alert>}
        {!loading && !error && (
          <Row>
            <Col>
              <h5>Available Employees</h5>
              <ListGroup style={{ maxHeight: "300px", overflowY: "auto" }}>
                {availableEmployees.map((e) => (
                  <ListGroup.Item
                    key={e.employeeId}
                    className="d-flex justify-content-between align-items-center"
                  >
                    {e.name}
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleAssign(e.employeeId)}
                    >
                      +
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
            <Col>
              <h5>Assigned Employees</h5>
              <ListGroup style={{ maxHeight: "300px", overflowY: "auto" }}>
                {assignedEmployees.map((e) => (
                  <ListGroup.Item
                    key={e.employeeId}
                    className="d-flex justify-content-between align-items-center"
                  >
                    {e.name}
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleUnassign(e.employeeId)}
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
        <Button variant="primary" onClick={handleClose}>
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
