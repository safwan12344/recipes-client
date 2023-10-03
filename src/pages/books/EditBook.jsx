import React, { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import "./EditBook.css";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSnapshot } from "valtio";
import authState from "../../states/auth";
import useSWR from "swr";
import { useEffect } from "react";

const schema = yup.object({
  name: yup.string().required(),
  orderLink: yup.string().required(),
  imageURL: yup
    .mixed()
    .nullable()
    .test({
      message: "image URL should be of type PNG",
      test: (file) => {
        if (!file || file.length == 0) {
          return true;
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
          return true;
        }
        const sizeLimit = 3;
        const totalSizeInMB = file[0].size / 1000000;
        const isValid = totalSizeInMB <= sizeLimit;
        return isValid;
      },
    }),
});

const fetcher = async (key, token) => {
  const response = await axios.get(key, {
    headers: {
      Authorization: `TOKEN ${token}`,
    },
  });
  return response.data;
};

function EditBook() {
  const { id } = useParams();
  const authSnap = useSnapshot(authState);

  const { data, isLoading } = useSWR(
    `${process.env.REACT_APP_API_URL}/books/my/${id}`,
    async (key) => await fetcher(key, authSnap.token),
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: data?.name || "",
      orderLink: data?.orderLink || "",
    },
    resolver: yupResolver(schema),
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      setValue("name", data.name);
      setValue("orderLink", data.orderLink);
    }
  }, [isLoading]);

  const updateBook = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("orderLink", values.orderLink);
      if (values.imageURL.length > 0) {
        formData.append("imageFile", values.imageURL[0]);
      }
      await axios.put(`${process.env.REACT_APP_API_URL}/books/${id}`, formData, {
        headers: {
          Authorization: `TOKEN ${authSnap.token}`,
        },
      });
      setShowAlert(true);
      setAlertVariant("success");
      setAlertText("book successfuly updated");
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
  const deleteBook = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/books/${id}`, {
        headers: {
          Authorization: `TOKEN ${authSnap.token}`,
        },
      });
      setShowAlert(true);
      setAlertVariant("success");
      setAlertText("book successfuly deleted");
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

  if (isLoading) {
    return <div>loading book</div>;
  }

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
      <Form onSubmit={handleSubmit(updateBook)}>
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
          Update Book
        </Button>
        <Button variant='danger' type='button' onClick={deleteBook}>
          Delete Book
        </Button>
      </Form>
    </div>
  );
}

export default EditBook;
