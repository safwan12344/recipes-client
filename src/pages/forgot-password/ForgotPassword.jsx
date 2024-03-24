import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "../../utils/axios";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const onFogotPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/forgot-password`, { email });
    } catch (error) {
      toast.error("Unknown error please try later");
    }
  };
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Form style={{ width: "40%" }} onSubmit={onFogotPassword} autoComplete='off'>
        <div style={{ color: "black", fontWeight: "bold" }}>
          Enter the email address associated with your account
        </div>
        <div style={{ color: "black", fontWeight: "bold" }}>
          and we will send you a link to reset your password Email
        </div>
        <Form.Group className='mb-3 mt-4'>
          <Form.Label>Email</Form.Label>
          <Form.Control
            onChange={onEmailChange}
            value={email}
            type='text'
            placeholder='Enter Email'
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
