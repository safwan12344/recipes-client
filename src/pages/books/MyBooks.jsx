import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Books from "../../components/books/Books";
import useSWR from "swr";
import axios from "axios";
import { useSnapshot } from "valtio";
import authState from "../../states/auth";

const fetcher = async (key, token) => {
  const response = await axios.get(key, {
    headers: {
      Authorization: `TOKEN ${token}`,
    },
  });
  return response.data;
};

export default function MyBooks() {
  const authSnap = useSnapshot(authState);
  const { data, isLoading } = useSWR(
    `${process.env.REACT_APP_API_URL}/books/my`,
    async (key) => await fetcher(key, authSnap.token),
  );

  if (isLoading) {
    return <div>Loading user books...</div>;
  }

  return (
    <div>
      <h1>My Books</h1>
      <Link to={"/books/new"}>
        <Button variant='primary'>Add Book</Button>
      </Link>
      <Books books={data} />
    </div>
  );
}
