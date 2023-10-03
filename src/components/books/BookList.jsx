import "./BookList.css";
import axios from "axios";
import useSWR from "swr";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

const fetcher = async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/books`);
  return response.data;
};

const Carosel = () => {
  const { data, isLoading } = useSWR(`${process.env.REACT_APP_API_URL}/books`, fetcher);

  if (isLoading) {
    return <div>Loaidng books...</div>;
  }

  return (
    <div className='books-container'>
      <div className='order-books'>
        <span className='order-book-text'>Order Books</span>
        <i className='fa-solid fa-book' style={{ color: "#f4c415", marginLeft: 5 }}></i>
      </div>
      <OwlCarousel
        autoplayHoverPause
        dots={false}
        items={data.length >= 4 ? 4 : data.length}
        autoplay
        lazyLoad
        className='owl-theme'
        loop
        margin={10}
        nav
      >
        {data.map((b) => (
          <div key={b._id} className='book'>
            <a href={b.orderLink} target='_blank' rel='noreferrer'>
              <img className='book-image' alt={b.name} loading='lazy' src={b.imageURL} />
            </a>
          </div>
        ))}
      </OwlCarousel>
    </div>
  );
};

export default Carosel;
