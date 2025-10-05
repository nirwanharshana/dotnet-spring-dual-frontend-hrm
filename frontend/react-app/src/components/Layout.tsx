import { Outlet, NavLink } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

export const Layout = () => {
  return (
    <>
      <Navbar
        style={{ backgroundColor: "var(--header-bg)" }}
        variant="dark"
        expand="lg"
      >
        <Container>
          <Navbar.Brand href="/">Employee Management Portal</Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar-nav" />
          <Navbar.Collapse id="main-navbar-nav">
            <Nav className="ms-auto">
              <NavLink to="/employees" className="nav-link">
                Employees
              </NavLink>
              <NavLink to="/departments" className="nav-link">
                Departments
              </NavLink>
              <NavLink to="/projects" className="nav-link">
                Projects
              </NavLink>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <main>
        <Container className="my-4">
          <Outlet />
        </Container>
      </main>
    </>
  );
};
