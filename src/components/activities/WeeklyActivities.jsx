import axios from "../../utils/axios";
import useSWR from "swr";
import "./WeeklyActivities.css";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const fetcher = async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/activities/weekly`);
  return response.data;
};
export default function WeeklyActivities() {
  const { data, isLoading } = useSWR(`${process.env.REACT_APP_API_URL}/activities/weekly`, fetcher);

  if (isLoading) {
    return <div>Loaidng activities...</div>;
  }

  return (
    <div className='weekly-main-contianer'>
      <div className='link-container'>
        {" "}
        <Link className='monthly-activities-link' to={"/activities/monthly"}>
          view monthly activities
        </Link>
      </div>
      <div className='activties-title'>Weekly Activities</div>
      <div className='scrollable'>
        <div className='weekly-activities-container'>
          {data.length == 0 && <div>There are no activities for this week</div>}
          {data.map((activity) => {
            return (
              <Link className='activity-link' to={`/activity/${activity._id}`} key={activity._id}>
                <div className='activity'>
                  <img className='activity-image-url' src={activity.imageURL} />
                  <div className='activity-content'>
                    <div className='activity-name'>
                      <span className='propperty'>Name: </span>
                      {activity.name}
                    </div>
                    <div className='activity-date'>
                      <span className='propperty'>Date: </span>
                      {format(activity.date, "EEEE MMMM dd")}
                    </div>
                    <div className='activity-start-time'>
                      <span className='propperty'>Start: </span>
                      {activity.startTime}
                    </div>
                    <div className='activity-end-time'>
                      <span className='propperty'>End: </span>
                      {activity.endTime}
                    </div>
                    <div className='activity-location'>
                      <span className='propperty'>Location: </span>
                      {activity.location}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
