import axios from "../../utils/axios";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";
import authState from "../../states/auth";
import errorState from "../../states/error";
import Activities from "../../components/activities/Activities";

export default function MyActivities() {
  const navigate = useNavigate();
  const authSnap = useSnapshot(authState);
  const errorSnap = useSnapshot(errorState);
  const [data, setData] = useState([]);

  const addNewActivity = () => {
    navigate("/create-activity");
  };

  useEffect(() => {
    const getAllMyActivities = async () => {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/activities/my`, {
        headers: {
          authorization: `TOKEN ${authSnap.token}`,
        },
      });
      setData(response.data);
      errorSnap.setError(null);
    };

    getAllMyActivities();
  }, []);

  return (
    <div style={{ overflowY: "auto" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Button style={{ margin: "20px 0px 20px 0px" }} onClick={addNewActivity} variant='primary'>
          create new Activity
        </Button>
        <p style={{ marginLeft: "auto", marginRight: "auto", display: "inline-block" }}>
          My Activities
        </p>
      </div>

      <Activities
        activities={data}
        onActivityClick={(activity) => {
          navigate(`/edit-activity/${activity._id}`);
        }}
      />
    </div>
  );
}
