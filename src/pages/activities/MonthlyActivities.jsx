import axios from "../../utils/axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import Activities from "../../components/activities/Activities";
import useSWR from "swr";

const fetcher = async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/activities/monthly`);
  return response.data;
};

export default function MonthlyActivities() {
  const navigate = useNavigate();

  const { data, isLoading } = useSWR(
    `${process.env.REACT_APP_API_URL}/activities/monthly`,
    fetcher,
  );

  if (isLoading) {
    return <div>Loaidng activities...</div>;
  }

  return (
    <div style={{ overflowY: "auto" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <p style={{ marginLeft: "auto", marginRight: "auto", display: "inline-block" }}>
          Monthly Activities
        </p>
      </div>

      <Activities
        activities={data}
        onActivityClick={(activity) => {
          navigate(`/activity/${activity._id}`);
        }}
      />
    </div>
  );
}
