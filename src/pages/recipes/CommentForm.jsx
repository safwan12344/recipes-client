import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { Button, Form } from "react-bootstrap";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import axios from "axios";
import PropTypes from "prop-types";
import { useSnapshot } from "valtio";
import authState from "../../states/auth";
import { mutate } from "swr";
import { useNavigate } from "react-router-dom";

const commentSchema = yup.object({
  comment: yup.string().required(),
});

export default function CommentForm({ recpieId }) {
  const { register, handleSubmit, reset } = useForm({
    resolver: yupResolver(commentSchema),
  });

  const authSnap = useSnapshot(authState);
  const navigate = useNavigate();

  const addComment = async ({ comment }) => {
    if (!authSnap.token) {
      navigate("/login");
      return;
    }
    await axios.post(
      `${process.env.REACT_APP_API_URL}/recipes/${recpieId}/comments`,
      { comment: comment },
      {
        headers: {
          Authorization: `TOKEN ${authSnap.token}`,
        },
      },
    );
    await mutate(`${process.env.REACT_APP_API_URL}/recipes/${recpieId}`);
    reset();
  };

  return (
    <>
      {!authSnap.token && <p style={{ color: "red" }}>You need to To be logged in to comment</p>}
      <Form onSubmit={handleSubmit(addComment)}>
        <Form.Group className='mb-3' controlId='formBasicEmail'>
          <Form.Control
            disabled={!authSnap.token}
            {...register("comment")}
            as='textarea'
            type='text'
            placeholder='add comment'
          />
        </Form.Group>

        <Button disabled={!authSnap.token} variant='primary' type='submit'>
          Add Comment
        </Button>
      </Form>
    </>
  );
}

CommentForm.propTypes = {
  recpieId: PropTypes.string.isRequired,
};
