import PropTypes from "prop-types";

import "./RecipeComments.css";
import CommentForm from "./CommentForm";
import { useSnapshot } from "valtio";
import userState from "../../states/user";
import ReplyCommentForm from "./ReplyCommentForm";
export default function RecipeComments({ comments, recpieId }) {
  const userSnap = useSnapshot(userState);

  const renderReplies = (comment) => {
    if (comment.replies.length === 0) {
      return null;
    }
    return (
      <div className='replies-container'>
        {comment.replies.map((reply) => {
          return (
            <>
              <div className='reply' key={reply._id}>
                <p className='reply-username'>{reply.username}</p>
                <p className='reply-text'>{reply.comment}</p>
                {reply.username !== userSnap.user?.username && (
                  <ReplyCommentForm
                    commentId={reply._id}
                    recpieId={recpieId}
                    username={reply.username}
                  />
                )}
              </div>
              {renderReplies(reply)}
            </>
          );
        })}
      </div>
    );
  };

  const renderComment = (comment) => {
    return (
      <div className='comment' key={comment._id}>
        <p className='comment-username'>{comment.username}</p>
        <p className='comment-text'>{comment.comment}</p>
        {comment.username !== userSnap.user?.username && (
          <ReplyCommentForm
            commentId={comment._id}
            recpieId={recpieId}
            username={comment.username}
          />
        )}
        {renderReplies(comment)}
      </div>
    );
  };

  return (
    <div className='comments-container'>
      <h3 className='comments-title'>Comments</h3>

      <CommentForm recpieId={recpieId} />

      {comments.map((comment) => {
        return renderComment(comment);
      })}
    </div>
  );
}

RecipeComments.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.objectOf({
      _id: PropTypes.string,
      username: PropTypes.string,
      comment: PropTypes.string,
      replies: PropTypes.array,
    }),
  ).isRequired,
  recpieId: PropTypes.string.isRequired,
};
