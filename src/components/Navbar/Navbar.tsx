import Container from "react-bootstrap/Container";
import { Navbar, Nav } from "react-bootstrap";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { AuthRoutes, GeneralRoutes } from "../../routes/Routes";
import { useAuthContext } from "../../contexts/Auth/useAuthContext";
import { AuthStatus } from "../../constants/AuthConsts";
import { BACKEND_URL } from "../../constants/EnvConsts";
import { DataFetcher } from "../../utils/fetcherUtils";

const BasicExample = () => {
  const authParams = useAuthContext();
  const navigate = useNavigate();

  const handleSignOut = () => {
    DataFetcher.deleteData(`${BACKEND_URL}/signout`)
      .then(() => console.log("Deleted token in backend"))
      .catch((error) => console.log(`failed to delete server token: ${error}`));

    authParams.logout();
    navigate(GeneralRoutes.Home);
  };

  return (
    <>
      <Navbar
        expand="lg"
        data-bs-theme="dark"
        style={{ backgroundColor: "black", fontFamily: "Raleway" }}
      >
        <Container className="mx-3" fluid>
          <Navbar.Brand style={{ color: "#00de00" }}>Track It All</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {authParams.authStatus === AuthStatus.AUTH ? (
              <Nav className="me-auto">
                <Nav.Link className="text-light" onClick={handleSignOut}>
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
