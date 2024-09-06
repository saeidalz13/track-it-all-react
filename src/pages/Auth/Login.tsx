import { FormEvent, useRef, useState } from "react";
import { Button, Container, Form, InputGroup } from "react-bootstrap";
import CommonButton from "../../components/Buttons/CommonButton";
import NavigateButton from "../../components/Buttons/NavigateButton";
import { AuthRoutes, GeneralRoutes, ProfileRoutes } from "../../routes/Routes";
import { BACKEND_URL } from "../../constants/EnvConsts";
import { DataFetcher } from "../../utils/fetcherUtils";
import { StatusCodes } from "http-status-codes";
import { ReqLogin, RespLoginPayload } from "../../models/Auth/Login";
import { ApiResp } from "../../models/Api/ApiResp";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/Auth/useAuthContext";

const btnStyle: React.CSSProperties = {
  marginTop: "15px",
  padding: "10px 30px",
};

const Login = () => {
  const authParams = useAuthContext();
  const navigate = useNavigate();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loginError, setLoginError] = useState<string>("");

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (!emailRef || !emailRef.current?.value) {
      setLoginError("Please provide your email");
      setTimeout(() => setLoginError(""), 5000);
      return;
    }

    if (!passwordRef || !passwordRef.current?.value) {
      setLoginError("Please provide your password");
      setTimeout(() => setLoginError(""), 5000);
      return;
    }

    const loginData: ReqLogin = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const resp = await DataFetcher.postData<ReqLogin>(
        `${BACKEND_URL}/login`,
        loginData,
        "include"
      );

      const apiResp: ApiResp<RespLoginPayload> = await resp.json();

      if (
        resp.status === StatusCodes.INTERNAL_SERVER_ERROR ||
        resp.status == StatusCodes.NOT_FOUND
      ) {
        if (apiResp.error) {
          setLoginError(apiResp.error);
          setTimeout(() => setLoginError(""), 5000);
          return;
        }
      }

      if (resp.status === StatusCodes.OK) {
        if (!apiResp.payload) {
          setLoginError("Server Error! Please Try Again Later");
          setTimeout(() => setLoginError(""), 5000);
          return;
        }
        authParams.login(apiResp.payload.email, apiResp.payload.user_id);
        navigate(ProfileRoutes.Profile);
        return;
      }

      console.error(resp);
      setLoginError("Unexpected Error! Please Try Again Later");
      setTimeout(() => setLoginError(""), 5000);
    } catch (error) {
      console.error(error);
      setLoginError("Unexpected Error! Please Try Again Later");
      setTimeout(() => setLoginError(""), 5000);
      return;
    }
  };

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
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3 p-0" controlId="formBasicEmail">
            <Form.Label className="common-form-label">Email address</Form.Label>
            <Form.Control
              className="common-form-input"
              type="email"
              placeholder="Enter email"
              ref={emailRef}
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
                ref={passwordRef}
              />
            </InputGroup>
          </Form.Group>
          <CommonButton
            variant="success"
            text="Submit"
            style={btnStyle}
            type="submit"
          ></CommonButton>
          {loginError === "" ? (
            ""
          ) : (
            <div className="text-center">
              <Form.Text className="text-danger">{loginError}</Form.Text>
            </div>
          )}
        </Form>

        <NavigateButton text="Home" url={GeneralRoutes.Home} style={btnStyle} />

        <NavigateButton
          text="No account yet? Sign in here"
          variant="link"
          url={AuthRoutes.Signup}
          divStyle={{ marginTop: "10px" }}
          style={{ color: "#CDC2A5" }}
        />
      </Container>
    </>
  );
};

export default Login;
