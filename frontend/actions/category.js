import fetch from "isomorphic-fetch";
import { API } from "../config";
import { handleResponse } from "./auth";

//Create a Category Method
export const create = (category, token) => {
  //url match the end point in our backend
  return fetch(`http://localhost:8000/api/category`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(category),
  })
    .then((response) => {
      handleResponse(response);
      return response.json();
    })
    .catch((err) => console.log(err));
};

//Get all the Categories Method
export const getCategories = () => {
  //url match the end point in our backend
  return fetch(`http://localhost:8000/api/categories`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

//Get a Single Category Method
export const singleCategory = (slug) => {
  //url match the end point in our backend
  return fetch(`http://localhost:8000/api/category/${slug}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

//Remove a Category Method
export const removeCategory = (slug, token) => {
  //url match the end point in our backend
  return fetch(`http://localhost:8000/api/category/${slug}`, {
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
