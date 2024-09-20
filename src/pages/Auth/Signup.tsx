import React, { FormEvent, useState } from "react";
import {
  Col,
  Container,
  Form,
  Row,
  InputGroup,
  Button,
  Spinner,
} from "react-bootstrap";
import CommonButton from "../../components/Buttons/CommonButton";
import NavigateButton from "../../components/Buttons/NavigateButton";
import { AuthRoutes, GeneralRoutes, ProfileRoutes } from "../../routes/Routes";
import { BACKEND_URL } from "../../constants/EnvConsts";
import { ReqSignup, RespSignupPayload } from "../../models/Auth/Signup";
import { ApiResp } from "../../models/Api/ApiResp";
import { useAuthContext } from "../../contexts/Auth/useAuthContext";
import { useNavigate } from "react-router-dom";
import { DataFetcher } from "../../utils/fetcherUtils";
import { StatusCodes } from "http-status-codes";

const btnStyle: React.CSSProperties = {
  marginTop: "15px",
  padding: "10px 30px",
};

const btnDivStyle: React.CSSProperties = {
  textAlign: "center",
};

const Signup = () => {
  const authParams = useAuthContext();
  const navigate = useNavigate();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [emailErr, setEmailErr] = useState<string>("");
  const [pw, setPw] = useState<string>("");
  const [pwErr, setPwErr] = useState<string>("");
  const [pwConf, setPwConf] = useState<string>("");
  const [pwConfErr, setPwConfErr] = useState<string>("");
  const [submitErr, setSubmitErr] = useState<string>("");
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState<boolean>(false);

  const specialChars = /[`!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?~ ]/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmail = () => {
    if (email === "") {
      setEmailErr("");
      return;
    }

    if (!emailRegex.test(email)) {
      setEmailErr("Invalid form of email");
    } else {
      setEmailErr("");
    }
  };

  const validatePassword = () => {
    if (pw == "") {
      setPwErr("");
      return;
    }

    if (pw.length <= 8) {
      setPwErr("Length must be equal or grater than 8");
      return;
    }

    if (!specialChars.test(pw)) {
      setPwErr("Must contain at least one special character");
      return;
    }

    if (!/\d/.test(pw)) {
      setPwErr("Must contain at least one number");
      return;
    }

    setPwErr("");
  };

  const validateConfirmPassword = () => {
    if (pwConf == "") {
      setPwConfErr("");
      return;
    }

    if (pwConf !== pw) {
      setPwConfErr("Must match password");
      return;
    }

    setPwConfErr("");
  };

  const handleSubmitForm = async (event: FormEvent) => {
    event.preventDefault();

    if (pw === "" || email === "" || pwConf === "") {
      setSubmitErr("Make sure the input fields are complete");
      setTimeout(() => {
        setSubmitErr("");
      }, 3000);
      return;
    }

    if (pwErr !== "" || emailErr !== "" || pwConfErr !== "") {
      setSubmitBtnDisabled(false);
      setSubmitErr("Fix all the issues before submission");

      setTimeout(() => {
        setSubmitErr("");
      }, 3000);
      return;
    }

    setSubmitBtnDisabled(true);

    const reqBody: ReqSignup = {
      email: email,
      password: pw,
    };

    try {
      const resp = await DataFetcher.postData(
        `${BACKEND_URL}/signup`,
        reqBody,
      );
      const apiResp: ApiResp<RespSignupPayload> = await resp.json();
      
      if (resp.status === StatusCodes.OK) {
        if (!apiResp.payload) {
          setSubmitErr("Server Error! Please Try Again Later");
          setTimeout(() => setSubmitErr(""), 5000);
          return;
        }

        authParams.login(apiResp.payload.email, apiResp.payload.user_id);
        navigate(ProfileRoutes.Profile);
        return;
      }

      if (
        resp.status === StatusCodes.INTERNAL_SERVER_ERROR ||
        resp.status == StatusCodes.NOT_FOUND
      ) {
        if (apiResp.error) {
          setSubmitErr(apiResp.error);
          setTimeout(() => setSubmitErr(""), 3000);
          return;
        }
      }

      console.error(resp);
      setSubmitErr("Unexpected Error! Please Try Again Later");
      setTimeout(() => setSubmitErr(""), 5000);
    } catch (err) {
      if (err instanceof Error) {
        setSubmitErr(err.message);
      } else {
        setSubmitErr("An unexpected error occurred");
      }
      setTimeout(() => setSubmitErr(""), 3000);
    } finally {
      setSubmitBtnDisabled(false);
    }
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
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyUp={validateEmail}
                  ></Form.Control>
                  {emailErr === "" ? (
                    ""
                  ) : (
                    <Form.Text className="text-danger">{emailErr}</Form.Text>
                  )}
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
                      onChange={(e) => setPw(e.target.value)}
                      onKeyUp={validatePassword}
                    />
                  </InputGroup>

                  {pwErr === "" ? (
                    ""
                  ) : (
                    <Form.Text className="text-danger">{pwErr}</Form.Text>
                  )}
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
                      onChange={(e) => setPwConf(e.target.value)}
                      onKeyUp={validateConfirmPassword}
                    />
                  </InputGroup>
                  {pwConfErr === "" ? (
                    ""
                  ) : (
                    <Form.Text className="text-danger">{pwConfErr}</Form.Text>
                  )}
                </Form.Group>
                <CommonButton
                  variant="success"
                  text={
                    submitBtnDisabled ? (
                      <Spinner animation="border" variant="danger" />
                    ) : (
                      "Submit"
                    )
                  }
                  style={btnStyle}
                  divStyle={btnDivStyle}
                  type="submit"
                  disabled={submitBtnDisabled}
                ></CommonButton>
                {submitErr === "" ? (
                  ""
                ) : (
                  <div className="text-center">
                    <Form.Text className="text-danger">{submitErr}</Form.Text>
                  </div>
                )}
              </Form>

              <NavigateButton
                text="Home"
                url={GeneralRoutes.Home}
                style={btnStyle}
                divStyle={btnDivStyle}
                disabled={submitBtnDisabled}
              />

              <NavigateButton
                text="Already have an account? Log in here"
                variant="link"
                url={AuthRoutes.Login}
                divStyle={{ marginTop: "10px", textAlign: "center" }}
                style={{ color: "#CDC2A5" }}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Signup;
