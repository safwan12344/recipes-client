// import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import axios from "../../utils/axios";
import { useNavigate, Link, useLocation } from "react-router-dom";

import "./Login.css";
import { useSnapshot } from "valtio";
import userState from "../../states/user";
import authState from "../../states/auth";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const authSnap = useSnapshot(authState);
  const userSnap = useSnapshot(userState);

  const location = useLocation();

  const navigate = useNavigate();

  const onLogin = async (e) => {
    e.preventDefault();
    try {
      console.log(password);

      let response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        username: username,
        password: password,
      });
      setErrorMessage("");
      authSnap.setToken(response.data.token);

      response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/me`, {
        headers: {
          Authorization: `TOKEN ${response.data.token}`,
        },
      });
      userSnap.setUser(response.data.user);
      if (location.state?.goBack) {
        navigate(-1);
      } else {
        navigate("/");
      }
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
