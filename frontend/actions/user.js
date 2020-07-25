import fetch from "isomorphic-fetch";
import { API } from "../config";
import { handleResponse } from "./auth";

//Get users public profile
export const userPublicProfile = (username) => {
  //url match the end point in our backend
  return fetch(`http://localhost:8000/api/user/${username}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

//Get user profile to update
export const getProfile = (token) => {
  //url match the end point in our backend
  return fetch(`http://localhost:8000/api/user/profile`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      handleResponse(response);
      return response.json();
    })
    .catch((err) => console.log(err));
};

//update user profile to update
export const updateProfile = (token, user) => {
  //url match the end point in our backend
  return fetch(`http://localhost:8000/api/user/update`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: user,
  })
    .then((response) => {
      handleResponse(response);
      return response.json();
    })
    .catch((err) => console.log(err));
};
