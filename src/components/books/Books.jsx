import PropTypes from "prop-types";
import { Card } from "react-bootstrap";
import "./Books.css";
import { useNavigate } from "react-router-dom";

export default function Books({ books }) {
  const navigate = useNavigate();
  const onBookClick = (book) => {
    navigate(`/books/${book._id}`);
  };
  return (
    <div className='container-books'>
      {books.map((book) => {
        return (
          <Card onClick={() => onBookClick(book)} key={book._id} className='book'>
            <Card.Img className='img-book' variant='top' src={book.imageURL} />
            <Card.Body>
              <Card.Title>{book.name}</Card.Title>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
}
Books.propTypes = {
  books: PropTypes.array.isRequired,
};
