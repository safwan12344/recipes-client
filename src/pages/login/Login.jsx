// import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import "./Login.css";
import AuthContext from "../../context/AuthContext";
import UserContext from "../../context/UserContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const auth = useContext(AuthContext);
  const user = useContext(UserContext);
  const navigate = useNavigate();

  const onLogin = async (e) => {
    e.preventDefault();
    try {
      let response = await axios.post("http://localhost:3002/auth/login", {
        username: username,
        password: password,
      });
      setErrorMessage("");
      auth.setToken(response.data.token);
      localStorage.setItem("token", JSON.stringify(response.data.token));

      response = await axios.get("http://localhost:3002/auth/me", {
        headers: {
          Authorization: `TOKEN ${response.data.token}`,
        },
      });
      user.setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/");
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };
  const onUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };
  return (
    <>
      <div className='login-background'></div>
      <div className='d-flex w-100 h-100'>
        <div className='login-wrap'>
          <div className='login-left-side'></div>
          <div className='login-right-side'>
            <h1 className='login-title'>Login</h1>
            <Link to={"/"}>Home Page</Link>
            <Form onSubmit={onLogin} autoComplete='off'>
              <Form.Group className='mb-3' controlId='formUsername'>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  onChange={onUsernameChange}
                  value={username}
                  type='text'
                  placeholder='username'
                />
              </Form.Group>

              <Form.Group className='mb-3' controlId='formPassword'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  onChange={onPasswordChange}
                  value={password}
                  type='password'
                  placeholder='password'
                />
              </Form.Group>

              {errorMessage && (
                <Form.Group className='mb-3'>
                  <Form.Label className='errorMessage'>{errorMessage}</Form.Label>
                </Form.Group>
              )}
              <Form.Group className='mb-3' controlId='formSubmit'>
                <Button variant='primary' type='submit'>
                  Submit
                </Button>
              </Form.Group>

              <Form.Group className='mb-3' controlId='formForgotPassword'>
                <a className='login-forgot-password' href='forgot_password.html'>
                  Forgot password
                </a>
              </Form.Group>
              <Form.Group className='mb-3' controlId='formSignup'>
                <Link to={"/signup"}>not a member ? Sign up</Link>
              </Form.Group>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
