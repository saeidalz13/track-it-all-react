import React, { FormEvent, useState } from "react";
import { Col, Container, Form, Row, InputGroup, Button } from "react-bootstrap";
import CommonButton from "../../components/Buttons/CommonButton";
import NavigateButton from "../../components/Buttons/NavigateButton";
import { GeneralRoutes } from "../../routes/Routes";

const btnStyle: React.CSSProperties = {
  marginTop: "15px",
  padding: "10px 30px",
};

const Signup = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSubmitForm = (event: FormEvent) => {
    console.log(event);
    // event.preventDefault();
  };
  return (
    <>
      <h1 className="common-h1 mt-5 text-center">Start Tracking Today!</h1>
      <Container>
        <Row>
          <Col>
            <div
              style={{
                margin: "50px auto",
                maxWidth: "500px",
                textAlign: "center",
              }}
            >
              <Form onSubmit={handleSubmitForm}>
                <Form.Group className="mb-3 p-0" controlId="formBasicEmail">
                  <Form.Label className="common-form-label">
                    Email address
                  </Form.Label>
                  <Form.Control
                    className="common-form-input"
                    type="email"
                    placeholder="Enter email"
                  ></Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label className="common-form-label">
                    Password
                  </Form.Label>
                  <InputGroup>
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        setIsPasswordVisible(() => !isPasswordVisible)
                      }
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

                <Form.Group
                  className="mb-3"
                  controlId="formBasicConfirmPassword"
                >
                  <Form.Label className="common-form-label">
                    Confirm Password
                  </Form.Label>

                  <InputGroup>
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        setIsPasswordVisible(() => !isPasswordVisible)
                      }
                    >
                      {isPasswordVisible ? "🙈" : "👁️"}
                    </Button>
                    <Form.Control
                      className="common-form-input"
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="Confirm Password"
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

              <NavigateButton
                text="Home"
                url={GeneralRoutes.Home}
                style={btnStyle}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Signup;
