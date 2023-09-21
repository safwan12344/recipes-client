import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
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

export default function ReplyCommentForm({ recpieId, commentId, username }) {
  const { register, handleSubmit, reset } = useForm({
    resolver: yupResolver(commentSchema),
  });

  const [showReplyComment, setShowReplyComment] = useState(false);
  const navigate = useNavigate();

  const authSnap = useSnapshot(authState);

  const addComment = async ({ comment }) => {
    if (!authSnap.token) {
      navigate("/login");
      return;
    }
    await axios.post(
      `${process.env.REACT_APP_API_URL}/recipes/${recpieId}/comments/${commentId}`,
      { comment: comment },
      {
        headers: {
          Authorization: `TOKEN ${authSnap.token}`,
        },
      },
    );
    await mutate(`${process.env.REACT_APP_API_URL}/recipes/${recpieId}`);
    reset();
    setShowReplyComment(false);
  };

  const displayComment = () => {
    setShowReplyComment(true);
  };

  return (
    <>
      {!showReplyComment && (
        <Button disabled={!authSnap.token} variant='secondary' size='sm' onClick={displayComment}>
          Reply to @{username}{" "}
        </Button>
      )}
      {showReplyComment && (
        <Form onSubmit={handleSubmit(addComment)}>
          <Form.Group className='mb-3' controlId='formBasicEmail'>
            <Form.Control
              {...register("comment")}
              as='textarea'
              type='text'
              placeholder='add comment'
            />
          </Form.Group>

          <Button variant='primary' type='submit'>
            Add Comment
          </Button>
        </Form>
      )}
    </>
  );
}

ReplyCommentForm.propTypes = {
  recpieId: PropTypes.string.isRequired,
  commentId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
};
