import Container from "react-bootstrap/Container";
import { Navbar, Nav } from "react-bootstrap";
import { Outlet, Link } from "react-router-dom";
import { AuthRoutes } from "../../routes/Routes";
import { useAuthContext } from "../../contexts/Auth/useAuthContext";

const BasicExample = () => {
  const authParams = useAuthContext();


  const handleSignOut = () => {
    authParams.logout();
  };

  return (
    <>
      <Navbar
        expand="lg"
        data-bs-theme="dark"
        style={{ backgroundColor: "black" }}
      >
        <Container className="mx-3" fluid>
          <Navbar.Brand className="text-info">Track It All</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {authParams.isAuthenticted ? (
              <Nav className="me-auto">
                <Nav.Link className="text-warning" onClick={handleSignOut}>
                  Sign Out
                </Nav.Link>
              </Nav>
            ) : (
              <Nav className="me-auto">
                <Nav.Link
                  className="text-light"
                  as={Link}
                  to={AuthRoutes.Signup}
                >
                  Sign Up
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  className="text-light"
                  to={AuthRoutes.Login}
                >
                  Log In
                </Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main>
        <Outlet />
      </main>
    </>
  );
};

export default BasicExample;

{
  /* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  Something
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown> */
}
