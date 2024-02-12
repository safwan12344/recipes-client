import { useNavigate, useParams } from "react-router-dom";
import axios from "../../utils/axios";
import useSWR, { mutate } from "swr";
import { format } from "date-fns";
import "./Activity.css";
import { Button } from "react-bootstrap";
import toast from "react-hot-toast";
import { useSnapshot } from "valtio";
import userState from "../../states/user";
import authState from "../../states/auth";
import { useState } from "react";
import ActivityShareModal from "../../components/activities/ActivityShareModal";

const fetcher = (id) => {
  return async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/activities/${id}`);
    return response.data;
  };
};

export default function Activity() {
  const params = useParams();
  const userSnap = useSnapshot(userState);
  const authSnap = useSnapshot(authState);
  const [modalShow, setModalShow] = useState(false);
  const navigate = useNavigate();
  const { data, isLoading } = useSWR(
    `${process.env.REACT_APP_API_URL}/activities/${params.id}`,
    fetcher(params.id),
  );

  const openShareModal = () => {
    setModalShow(true);
  };

  if (isLoading) {
    return <div>Loaidng Activity...</div>;
  }
  const onAttend = async () => {
    if (!userSnap.user) {
      return navigate("/login", { state: { goBack: true } });
    }
    toast.promise(
      axios
        .get(`${process.env.REACT_APP_API_URL}/activities/${params.id}/toggle-participent`, {
          headers: {
            Authorization: `TOKEN ${authSnap.token}`,
          },
        })
        .then(() => mutate(`${process.env.REACT_APP_API_URL}/activities/${params.id}`)),
      {
        loading: "Attending...",
        success: (
          <b>
            You have successfully registered for the event and an email will be sent to you
            immediately
          </b>
        ),
        error: <b>Unknown error will try later</b>,
      },
    );
  };

  const isUserAttending = data.participants.some((p) => p === userSnap.user?.username);
  const canAttend = !(data.maxOfParticipants === data.participants.length && !isUserAttending);

  return (
    <div className='activity-root-container'>
      <div className='activity-main'>
        <h1 className='activity-name'>{data.name}</h1>

        <div className='container'>
          <div className='activity-img-container'>
            <img className='activity-img' src={data.imageURL} />
          </div>
          <div className='container-props'>
            <div className='activity-date-container'>
              <i className='fa-regular fa-clock activity-icon'></i>
              <div className='activity-date'>{format(data.date, "EEEE MMMM dd")}</div>
            </div>
            <div className='activity-location-container'>
              <i className='fa-solid fa-location-dot activity-icon'></i>
              <div className='activity-location'>{data.location}</div>
            </div>
            <div className='activity-participants-container'>
              <i className='fa-solid fa-people-group activity-icon'></i>
              <div className='activity-participants'>{data.maxOfParticipants}</div>
            </div>
            {!canAttend && <div className='full-event'>this event is full</div>}
            <div className={`container-button ${canAttend && "push-down"}`}>
              <Button
                disabled={!canAttend}
                onClick={onAttend}
                className='button-attend'
                variant={isUserAttending ? "danger" : "primary"}
              >
                {isUserAttending ? "Cancel Participation" : "Attend"}
              </Button>
              <Button onClick={openShareModal} className='button-share' variant='outline-primary'>
                Share{" "}
                <i style={{ marginLeft: "4px" }} className='fa-regular fa-share-from-square'></i>
              </Button>
              <ActivityShareModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                activity={data}
              />
            </div>
          </div>
        </div>
        <div className='activity-details-container'>
          <h2 className='activity-details1'> Details</h2>
          <p className='details'>{data.details}</p>
        </div>
      </div>
    </div>
  );
}
