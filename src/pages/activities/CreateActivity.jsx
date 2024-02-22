import { Button, Form } from "react-bootstrap";
import "./CreateActivity.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { activitySchema } from "./activity-validation";
import { format } from "date-fns";
import axios from "../../utils/axios";
import { useSnapshot } from "valtio";
import authState from "../../states/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function CreateActivity() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(activitySchema),
  });

  const snapshot = useSnapshot(authState);
  const navigate = useNavigate();

  const createNewActivity = async (values) => {
    console.log("submit");
    const fd = new FormData();
    fd.append("name", values.name);
    fd.append("imageFile", values.imageURL[0]);
    fd.append("startTime", values.startTime);
    fd.append("endTime", values.endTime);
    fd.append("date", format(values.date, "yyyy-MM-dd"));
    fd.append("location", values.location);
    fd.append("details", values.details);
    fd.append("maxOfParticipants", values.maxOfParticipants);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/activities/`, fd, {
        headers: {
          Authorization: `TOKEN ${snapshot.token}`,
        },
      });
      reset();
      toast.success("You have successfully created the activity");
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      toast.error("Unknown error, please try again later");
    }
  };

  return (
    <div className='create-activity-root'>
      <Form onSubmit={handleSubmit(createNewActivity)} className='create-activity-form'>
        <h1 className='create-activity'>Create Activity</h1>
        <Form.Group className='mb-3'>
          <Form.Label>Name</Form.Label>
          <Form.Control {...register("name")} type='text' placeholder='Enter name' />
          {errors.name?.message && (
            <Form.Text className='error-text-validation'>{errors.name?.message}</Form.Text>
          )}
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>Image</Form.Label>
          <Form.Control
            {...register("imageURL")}
            type='file'
            accept='image/png'
            placeholder='upload image'
          />
          {errors.imageURL?.message && (
            <Form.Text className='error-text-validation'>{errors.imageURL?.message}</Form.Text>
          )}
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>Date</Form.Label>
          <Form.Control {...register("date")} type='date' />
          {errors.date?.message && (
            <Form.Text className='error-text-validation'>{errors.date?.message}</Form.Text>
          )}
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>Start Time</Form.Label>
          <Form.Control {...register("startTime")} type='text' placeholder='00:00' />
          {errors.startTime?.message && (
            <Form.Text className='error-text-validation'>{errors.startTime?.message}</Form.Text>
          )}
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>End Time</Form.Label>
          <Form.Control {...register("endTime")} type='text' placeholder='00:00' />
          {errors.endTime?.message && (
            <Form.Text className='error-text-validation'>{errors.endTime?.message}</Form.Text>
          )}
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>Location</Form.Label>
          <Form.Control {...register("location")} type='text' placeholder='Enter location' />
          {errors.location?.message && (
            <Form.Text className='error-text-validation'>{errors.location?.message}</Form.Text>
          )}
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>Details</Form.Label>
          <Form.Control {...register("details")} as='textarea' placeholder='Enter details' />
          {errors.details?.message && (
            <Form.Text className='error-text-validation'>{errors.details?.message}</Form.Text>
          )}
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>Max Of Participants</Form.Label>
          <Form.Control {...register("maxOfParticipants")} type='number' placeholder='30' />
          {errors.maxOfParticipants?.message && (
            <Form.Text className='error-text-validation'>
              {errors.maxOfParticipants?.message}
            </Form.Text>
          )}
        </Form.Group>
        <Button variant='primary' type='submit'>
          Submit
        </Button>
      </Form>
    </div>
  );
}
