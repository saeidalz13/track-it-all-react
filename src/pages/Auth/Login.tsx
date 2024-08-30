import { useState } from "react";
import { Button, Container, Form, InputGroup } from "react-bootstrap";
import CommonButton from "../../components/Buttons/CommonButton";
import NavigateButton from "../../components/Buttons/NavigateButton";
import { AuthRoutes, GeneralRoutes } from "../../routes/Routes";

const btnStyle: React.CSSProperties = {
  marginTop: "15px",
  padding: "10px 30px",
};

const Login = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <>
      <h1 className="common-h1 mt-5 text-center">Continue Tracking!</h1>
      <Container
        style={{
          margin: "50px auto",
          maxWidth: "500px",
          textAlign: "center",
        }}
      >
        <Form>
          <Form.Group className="mb-3 p-0" controlId="formBasicEmail">
            <Form.Label className="common-form-label">Email address</Form.Label>
            <Form.Control
              className="common-form-input"
              type="email"
              placeholder="Enter email"
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label className="common-form-label">Password</Form.Label>
            <InputGroup>
              <Button
                variant="outline-secondary"
                onClick={() => setIsPasswordVisible(() => !isPasswordVisible)}
              >
                {isPasswordVisible ? "🙈" : "👁️"}
              </Button>
              <Form.Control
                className="common-form-input"
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Password"
              />
            </InputGroup>
          </Form.Group>
          <CommonButton
            variant="success"
            text="Submit"
            style={btnStyle}
            type="submit"
          ></CommonButton>
        </Form>

        <NavigateButton text="Home" url={GeneralRoutes.Home} style={btnStyle} />

        <NavigateButton
          text="No account yet? Sign in here"
          variant="link"
          url={AuthRoutes.Signup}
          divStyle={{marginTop: "10px"}}
          style={{color: "#CDC2A5"}}
        />
      </Container>
    </>
  );
};

export default Login;
