/* eslint-disable */
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import ReactStars from "react-rating-stars-component";
import axios from "axios";
import { useSnapshot } from "valtio";
import authState from "../../states/auth";
import userState from "../../states/user";
import RecipeComments from "./RecipeComments";
import useSWR from "swr";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

// const getRecpie = (recepieId) => {
//   return async () => {
//     debugger
//    return await axios.get(`${process.env.REACT_APP_API_URL}/recipes/${recepieId}`)
//   }
// }

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function RecipeDetails() {
  const params = useParams();
  const [show, setShow] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const authSnap = useSnapshot(authState);
  const userSnap = useSnapshot(userState);
  const navigate = useNavigate();

  const { data, isLoading } = useSWR(
    `${process.env.REACT_APP_API_URL}/recipes/${params.id}`,
    fetcher,
  );
  const recipe = data;
  console.log({ data });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const ratingChanged = async (userRating) => {
    setUserRating(userRating);
  };
  const updateRecepieRating = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/recipes/${recipe._id}/rating`,
        { userRating },
        {
          headers: {
            authorization: `TOKEN ${authSnap.token}`,
          },
        },
      );
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const getIconStar = (starPlace, minStar) => {
    if (recipe.rating.toFixed(2) >= starPlace) {
      return "fa-solid fa-star";
    }
    if (recipe.rating.toFixed(2) >= minStar) {
      return "fa-solid fa-star-half-stroke";
    }
    return "fa-regular fa-star";
  };

  const onRating = () => {
    if (!userSnap.user) {
      return navigate("/login", { state: { goBack: true } });
    }
    if (userSnap.user.role === "user") {
      return handleShow();
    }
  };

  if (isLoading) {
    return <div>fetching recpie ...</div>;
  }

  return (
    <div style={{ padding: "15px 0 0 20%", height: "100%" }}>
      <div style={{ fontWeight: "bold", fontSize: 30 }}>{recipe.name}</div>
      <div style={{ display: "flex", marginBottom: 10, marginTop: 10 }}>
        <div style={{ marginRight: 5, color: "#fff700" }}>
          <i className={getIconStar(1, 0.5)}></i>
          <i className={getIconStar(2, 1.5)}></i>
          <i className={getIconStar(3, 2.5)}></i>
          <i className={getIconStar(4, 3.5)}></i>
          <i className={getIconStar(5, 4.5)}></i>
        </div>
        <span style={{ marginRight: 40 }}>
          {recipe.rating.toFixed(2)} ({recipe.numberOfVotes.toLocaleString()})
        </span>
        {(userSnap.user?.role === "user" || !userSnap.user) && (
          <>
            <Button onClick={onRating} size='sm' variant='primary'>
              ADD RATING
            </Button>
            <Modal show={show} onHide={handleClose} backdrop='static' keyboard={false}>
              <Modal.Header closeButton>
                <Modal.Title>Rate this recipe</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <ReactStars
                  count={5}
                  onChange={ratingChanged}
                  size={40}
                  isHalf={true}
                  emptyIcon={<i className='fa-regular fa-star'></i>}
                  halfIcon={<i className='fa-solid fa-star-half-stroke'></i>}
                  fullIcon={<i className='fa-solid fa-star'></i>}
                  activeColor='#fff700'
                />
              </Modal.Body>
              <Modal.Footer>
                <Button variant='secondary' onClick={handleClose}>
                  Close
                </Button>
                <Button onClick={updateRecepieRating} variant='primary'>
                  send
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        )}
      </div>
      <div style={{ maxWidth: "40%" }}>{recipe.description}</div>
      <div style={{ marginTop: 10 }}>
        <FacebookShareButton url={window.location.href}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <WhatsappShareButton title={recipe.name} url={window.location.href}>
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
        <EmailShareButton url={window.location.href}>
          <EmailIcon size={32} round />
        </EmailShareButton>
      </div>
      <div>
        <img style={{ height: "400px", width: "500px", marginTop: 20 }} src={recipe.imageURL} />
      </div>
      <div>
        <div style={{ fontWeight: "bold", fontSize: 30, marginTop: 20, fontStyle: "italic" }}>
          Ingredients
        </div>
        <ul>
          {recipe.ingredients.map((item, index) => {
            return (
              <li style={{ marginTop: 20 }} key={item._id}>
                <span
                  style={{
                    padding: "5px 10px",
                    color: "black",
                    backgroundColor: index % 2 == 0 ? "rgba(0,0,0, 0.12)" : "rgba(238,96,85, 0.25)",
                  }}
                >{`${item.unit} ${item.name} ${item.amount}`}</span>
              </li>
            );
          })}
        </ul>
      </div>
      {recipe.preparation.map((value, index) => {
        return (
          <div style={{ marginBottom: 10 }} key={index}>
            <p style={{ marginBottom: 3, fontWeight: "bold", fontSize: 20 }}>{`Step ${++index}`}</p>
            <div style={{ maxWidth: "55%", fontStyle: "oblique" }}>{value}</div>
          </div>
        );
      })}
      <a
        style={{ color: "blue", border: "1px solid blue", cursor: "pointer", padding: 5 }}
        href={recipe.orderLink}
        target='_blank'
        rel='noreferrer'
      >
        Order now
      </a>
      <RecipeComments comments={recipe.comments} recpieId={recipe._id} />
    </div>
  );
}
