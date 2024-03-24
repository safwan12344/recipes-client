import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "../../utils/axios";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const params = useParams();

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const onConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };
  const onResetPassword = async (e) => {
    e.preventDefault();
    try {
      if (password != confirmPassword) {
        toast.error("passwords don't match");
        return;
      }
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/reset-password/${params.token}`, {
        password,
        confirmPassword,
      });
      toast.success("Your password has been changed");
    } catch (error) {
      if (error.response.status === 400) {
        toast.error(
          "Password chanage is valid for 5m only please send a new request to reset password",
        );
      } else {
        toast.error("Unknown error please try later");
      }
    }
  };
  return (
    <div
      style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Form onSubmit={onResetPassword} autoComplete='off'>
        <div style={{ color: "black", fontWeight: "bold" }}>
          Enter the email address associated with your account
        </div>
        <div style={{ color: "black", fontWeight: "bold" }}>
          and we will send you a link to reset your password
        </div>
        <Form.Group className='mb-3 mt-4'>
          <Form.Label>New Password</Form.Label>
          <Form.Control
            onChange={onPasswordChange}
            value={password}
            type='password'
            placeholder='Enter New Password'
          />
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            onChange={onConfirmPasswordChange}
            value={confirmPassword}
            type='password'
            placeholder='Enter Confirm Password'
          />
        </Form.Group>

        <Form.Group className='mb-3'>
          <Button variant='primary' type='submit'>
            Submit
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
}
