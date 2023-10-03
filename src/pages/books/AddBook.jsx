import React, { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import "./AddBook.css";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";
import authState from "../../states/auth";

const schema = yup.object({
  name: yup.string().required(),
  orderLink: yup.string().required(),
  imageURL: yup
    .mixed()
    .nullable()
    .test({
      message: "image URL is required",
      test: (file) => {
        if (!file || file.length == 0) {
          return false;
        }
        return true;
      },
    })
    .test({
      message: "image URL should be of type PNG",
      test: (file) => {
        if (!file || file.length == 0) {
          return false;
        }
        const ext = file[0].name.split(".")[1];
        const isValid = ["png"].includes(ext);
        return isValid;
      },
    })
    .test({
      message: `File too big, can't exceed 3MB`,
      test: (file) => {
        if (!file || file.length == 0) {
          return false;
        }
        const sizeLimit = 3;
        const totalSizeInMB = file[0].size / 1000000;
        const isValid = totalSizeInMB <= sizeLimit;
        return isValid;
      },
    }),
});

function AddBook() {
  const authSnap = useSnapshot(authState);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const navigate = useNavigate();

  const addBook = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("orderLink", values.orderLink);
      formData.append("imageFile", values.imageURL[0]);
      await axios.post(`${process.env.REACT_APP_API_URL}/books`, formData, {
        headers: {
          Authorization: `TOKEN ${authSnap.token}`,
        },
      });
      setShowAlert(true);
      setAlertVariant("success");
      setAlertText("book successfuly created");
      setTimeout(() => {
        setShowAlert(false);
        setAlertText("");
        navigate(-1);
      }, 3000);
    } catch (error) {
      setShowAlert(true);
      setAlertText(error.message);
      setAlertVariant("danger");
      setTimeout(() => {
        setShowAlert(false);
        setAlertText("");
      }, 3000);
    }
  };
  return (
    <div className='books-container'>
      <Alert
        className='alert-float'
        onClose={() => {
          setShowAlert(false);
        }}
        transition={true}
        dismissible={true}
        show={showAlert}
        variant={alertVariant}
      >
        {alertText}
      </Alert>
      <Form onSubmit={handleSubmit(addBook)}>
        <Form.Group className='mb-3'>
          <Form.Label>Name</Form.Label>
          <Form.Control {...register("name")} type='text' placeholder='Enter name book' />
          {errors.name?.message && (
            <Form.Text className='error-text-validation'>{errors.name?.message}</Form.Text>
          )}
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label>Order Link</Form.Label>
          <Form.Control {...register("orderLink")} type='text' placeholder='Enter order link' />
          {errors.orderLink?.message && (
            <Form.Text className='error-text-validation'>{errors.orderLink?.message}</Form.Text>
          )}
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label>Image</Form.Label>
          <Form.Control
            {...register("imageURL")}
            type='file'
            accept='image/png'
            placeholder='Enter order link'
          />
          {errors.imageURL?.message && (
            <Form.Text className='error-text-validation'>{errors.imageURL?.message}</Form.Text>
          )}
        </Form.Group>

        <Button variant='primary' type='submit'>
          Add Book
        </Button>
      </Form>
    </div>
  );
}

export default AddBook;
