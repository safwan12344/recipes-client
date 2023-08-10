import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";

import "./SignUp.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const SignUp = () => {
  const [firstname, setFirstname] = useState("");
  const [lastnmae, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const onFirstnameChange = (e) => {
    setFirstname(e.target.value);
  };
  const onLastnameChange = (e) => {
    setLastname(e.target.value);
  };
  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const onUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const onRoleChange = (e) => {
    setRole(e.target.value);
  };
  const onSignUp = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3002/users", {
        firstname,
        lastnmae,
        email,
        username,
        password,
        role,
      });
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className='signup-container'>
        <h1>Sign up</h1>
        <Form onSubmit={onSignUp} className='signup-form'>
          <Form.Group className='my-auto' controlId='formFirstname'>
            <Form.Label>First Name</Form.Label>
            <Form.Control
              onChange={onFirstnameChange}
              value={firstname}
              type='text'
              placeholder='Enter first name'
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='formLastname'>
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              onChange={onLastnameChange}
              value={lastnmae}
              type='text'
              placeholder='Enter last name'
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='formBasicEmail'>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              onChange={onEmailChange}
              value={email}
              type='email'
              placeholder='Enter email'
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='formUsername'>
            <Form.Label>Username</Form.Label>
            <Form.Control
              onChange={onUsernameChange}
              value={username}
              type='text'
              placeholder='Enter uesrname'
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='formPassword'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              onChange={onPasswordChange}
              value={password}
              type='password'
              placeholder='Password'
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='formRole'>
            <Form.Label>chose role</Form.Label>
            <Form.Select onChange={onRoleChange} value={role} aria-label='Default select example'>
              <option value='user'>User</option>
              <option value='business'>Business</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className='mb-3' controlId='formRole'>
            <Button
              disabled={!firstname || !lastnmae || !email || !password || !username}
              variant='primary'
              type='submit'
            >
              Sign Up
            </Button>
          </Form.Group>
          <Link to={"/login"}>Already member ? Log in</Link>
        </Form>
      </div>
    </>
  );
};

export default SignUp;
