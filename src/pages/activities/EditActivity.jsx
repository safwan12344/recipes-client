import { Button, Form } from "react-bootstrap";
import "./CreateActivity.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateActivitySchema } from "./activity-validation";
import { format } from "date-fns";
import axios from "../../utils/axios";
import { useSnapshot } from "valtio";
import authState from "../../states/auth";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";

const fetcher = async (key, token) => {
  const response = await axios.get(key, {
    headers: {
      Authorization: `TOKEN ${token}`,
    },
  });
  return response.data;
};

export default function EditActivity() {
  const { id } = useParams();
  const snapshot = useSnapshot(authState);
  // eslint-disable-next-line no-unused-vars
  const { data, isLoading } = useSWR(
    `${process.env.REACT_APP_API_URL}/activities/${id}`,
    async (key) => await fetcher(key, snapshot.token),
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    values: {
      name: data?.name || "",
      date: data?.date ? data.date.substring(0, 10) : "",
      startTime: data?.startTime || "",
      endTime: data?.endTime || "",
      location: data?.location || "",
      details: data?.details || "",
      maxOfParticipants: data?.maxOfParticipants || 0,
    },
    resolver: yupResolver(updateActivitySchema),
  });

  const navigate = useNavigate();

  const updateActivity = async (values) => {
    const fd = new FormData();
    fd.append("name", values.name);
    if (values.imageURL.length > 0) {
      fd.append("imageFile", values.imageURL[0]);
    }
    fd.append("startTime", values.startTime);
    fd.append("endTime", values.endTime);
    fd.append("date", format(values.date, "yyyy-MM-dd"));
    fd.append("location", values.location);
    fd.append("details", values.details);
    fd.append("maxOfParticipants", values.maxOfParticipants);

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/activities/${data._id}`, fd, {
        headers: {
          Authorization: `TOKEN ${snapshot.token}`,
        },
      });
      reset();
      toast.success("You have successfully updated the activity");
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      toast.error("Unknown error, please try again later");
    }
  };

  const deleteActivity = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/activities/${data._id}`, {
        headers: {
          Authorization: `TOKEN ${snapshot.token}`,
        },
      });
      toast.success("You have successfully deleted the activity");
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      toast.error("Unknown error, please try again later");
    }
  };

  if (isLoading) {
    return <div>Loading activity...</div>;
  }

  return (
    <div className='create-activity-root'>
      <Form onSubmit={handleSubmit(updateActivity)} className='create-activity-form'>
        <h1 className='create-activity'>Update Activity</h1>
        <Form.Group className='mb-3'>
          <Form.Label>Name</Form.Label>
          <Form.Control {...register("name")} type='text' placeholder='Enter name' />
          {errors.name?.message && (
            <Form.Text className='error-text-validation'>{errors.name?.message}</Form.Text>
          )}
        </Form.Group>

        <Form.Group className='mb-3'>
          <div>
            <img width={120} height={120} src={data.imageURL} />
          </div>
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
        <Button variant='danger' type='button' onClick={deleteActivity}>
          Delete Activity
        </Button>
      </Form>
    </div>
  );
}
