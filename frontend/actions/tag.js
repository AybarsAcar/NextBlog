import fetch from "isomorphic-fetch";
import { API } from "../config";
import { handleResponse } from "./auth";

//Create a Tag Method
export const create = (tag, token) => {
  //url match the end point in our backend
  return fetch(`http://localhost:8000/api/tag`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(tag),
  })
    .then((response) => {
      handleResponse(response);
      return response.json();
    })
    .catch((err) => console.log(err));
};

//Get all the Tags Method
export const getTags = () => {
  //url match the end point in our backend
  return fetch(`http://localhost:8000/api/tags`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

//Get a Single Tag Method
export const singleTag = (slug) => {
  //url match the end point in our backend
  return fetch(`http://localhost:8000/api/tag/${slug}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

//Remove a Category Method
export const removeTag = (slug, token) => {
  //url match the end point in our backend
  return fetch(`http://localhost:8000/api/tag/${slug}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      handleResponse(response);
      return response.json();
    })
    .catch((err) => console.log(err));
};
