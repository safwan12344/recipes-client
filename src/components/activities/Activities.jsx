import PropTypes from "prop-types";
import { Card } from "react-bootstrap";
import styles from "./activities.module.css";

export default function Activities({ activities, onActivityClick }) {
  return (
    <div className={styles.containerActivities}>
      {activities.map((activity) => {
        return (
          <Card
            onClick={() => onActivityClick(activity)}
            key={activity._id}
            className={styles.activity}
          >
            <Card.Img className={styles.imgActivity} variant='top' src={activity.imageURL} />
            <Card.Body>
              <div className={styles.titleContainer}>
                <Card.Title>{activity.name}</Card.Title>
              </div>

              <div className={styles.box}>
                <Card.Text className={styles.truncate}>{activity.details}</Card.Text>
              </div>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
}
Activities.propTypes = {
  activities: PropTypes.array.isRequired,
  onActivityClick: PropTypes.func.isRequired,
};
