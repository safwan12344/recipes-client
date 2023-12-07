import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "../../utils/axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import "./SignUp.css";
import { Link, useNavigate } from "react-router-dom";

const schema = yup
  .object({
    firstName: yup
      .string()
      .matches(/^[a-zA-Z]*$/, { message: "You must enter only English letters" })
      .required()
      .trim(),
    lastName: yup
      .string()
      .matches(/^[a-zA-Z]*$/, { message: "You must enter only English letters" })
      .required()
      .trim(),
    email: yup.string().email().required().trim().lowercase(),
    username: yup.string().min(5, "Must be at least 5 in length").required().trim().lowercase(),
    password: yup
      .string()
      .required("Required")
      .min(8, "Must be 8 characters or more")
      .matches(/[a-z]+/, "One lowercase character")
      .matches(/[A-Z]+/, "One uppercase character")
      .matches(/[@$!%*#?&]+/, "One special character")
      .matches(/\d+/, "One number"),
    role: yup
      .string()
      .required()
      .matches(/(user|business)/, "you must choose user or business"),
  })
  .required();

const SignUp = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSignUp = async (data) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/users`, data);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className='signup-container'>
        <h1>Sign up</h1>
        <Form onSubmit={handleSubmit(onSignUp)} className='signup-form'>
          <Form.Group className='my-auto' controlId='formFirstname'>
            <Form.Label>First Name</Form.Label>
            <Form.Control {...register("firstName")} type='text' placeholder='Enter first name' />

            {errors.firstName?.message && (
              <div style={{ color: "red" }}>{errors.firstName?.message}</div>
            )}
          </Form.Group>
          <Form.Group className='mb-3' controlId='formLastname'>
            <Form.Label>Last Name</Form.Label>
            <Form.Control {...register("lastName")} type='text' placeholder='Enter last name' />
            {errors.lastName?.message && (
              <div style={{ color: "red" }}>{errors.lastName?.message}</div>
            )}
          </Form.Group>
          <Form.Group className='mb-3' controlId='formBasicEmail'>
            <Form.Label>Email address</Form.Label>
            <Form.Control {...register("email")} type='email' placeholder='Enter email' />
            {errors.email?.message && <div style={{ color: "red" }}>{errors.email?.message}</div>}
          </Form.Group>
          <Form.Group className='mb-3' controlId='formUsername'>
            <Form.Label>Username</Form.Label>
            <Form.Control {...register("username")} type='text' placeholder='Enter uesrname' />
            {errors.username?.message && (
              <div style={{ color: "red" }}>{errors.username?.message}</div>
            )}
          </Form.Group>
          <Form.Group className='mb-3' controlId='formPassword'>
            <Form.Label>Password</Form.Label>
            <Form.Control {...register("password")} type='password' placeholder='Password' />
            {errors.password?.message && (
              <div style={{ color: "red" }}>{errors.password?.message}</div>
            )}
          </Form.Group>
          <Form.Group className='mb-3' controlId='formRole'>
            <Form.Label>chose role</Form.Label>
            <Form.Select {...register("role")} aria-label='Default select example'>
              <option value='user'>User</option>
              <option value='business'>Business</option>
            </Form.Select>
            {errors.role?.message && <div style={{ color: "red" }}>{errors.role?.message}</div>}
          </Form.Group>
          <Form.Group className='mb-3' controlId='formRole'>
            <Button variant='primary' type='submit'>
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
