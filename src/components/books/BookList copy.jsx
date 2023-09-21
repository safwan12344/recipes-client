import axios from "axios";
// import { Link } from 'react-router-dom'

// import Slider from 'react-slick'
//import PropTypes from 'prop-types'
import useSWR from "swr";
import "./Book.css";
import { useCallback, useEffect, useRef, useState } from "react";

const fetcher = async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/books`);
  return response.data;
};

// let timeoutId

function BookList() {
  const { data, isLoading } = useSWR(`${process.env.REACT_APP_API_URL}/books`, fetcher);
  const carousel = useRef(null);
  const wrapper = useRef(null);
  const [startX, setStartX] = useState(0);
  const [startXcrollLeft, setStartXScrollLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [width, setWidth] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const card = useCallback((node) => {
    if (node) {
      setWidth(node.offsetWidth);
    }
  }, []);

  useEffect(() => {
    if (carousel.current) {
      carousel.current.scrollLeft = width * currentIndex;
    }
  }, [currentIndex]);

  if (isLoading) {
    return <div>Loading books ...</div>;
  }

  const dragStart = (e) => {
    setIsDragging(true);
    if (carousel.current) {
      carousel.current.classList.add("dragging");
      setStartX(e.pageX);
      setStartXScrollLeft(carousel.current.scrollLeft);
    }
  };

  const dragging = (e) => {
    if (!isDragging) return;
    if (carousel.current) {
      carousel.current.scrollLeft = startXcrollLeft - (e.pageX - startX);
    }
  };

  // const autoPlay = () => {
  //   console.log("testing")
  //   timeoutId = setTimeout(() => {
  //     if(carousel.current){
  //       carousel.current.scrollLeft += width
  //     }
  //   }, 1500)
  // }

  const dragStop = () => {
    setIsDragging(false);
    if (carousel.current) {
      carousel.current.classList.remove("dragging");
    }
  };

  const onNext = () => {
    setCurrentIndex((currentIndex + 1) % data.length);
  };
  const onPrev = () => {
    setCurrentIndex(Math.abs(currentIndex - 1 + data.length) % data.length);
  };

  return (
    <div className='root'>
      <div ref={wrapper} className='wrapper'>
        <i onClick={onPrev} className='fa-solid fa-angle-left' />
        <ul
          ref={carousel}
          onMouseUp={dragStop}
          onMouseMove={dragging}
          onMouseDown={dragStart}
          className='carousel'
        >
          {data.map((book) => {
            return (
              <li ref={card} className='card' key={book._id}>
                <div className='img'>
                  <img src={book.imageURL} alt='img' draggable='false' />
                </div>
                <h2>{book.name}</h2>
              </li>
            );
          })}
        </ul>
        <i onClick={onNext} className='fa-solid fa-angle-right' />
      </div>
    </div>
  );
}

BookList.propTypes = {};

export default BookList;
