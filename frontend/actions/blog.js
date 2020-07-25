import fetch from "isomorphic-fetch";
import { API } from "../config";
import queryString from "query-string";
import { isAuth, handleResponse } from "./auth";

//Create a Blog Method
export const createBlog = (blog, token) => {
  let createBlogEndPoint;
  
  if (isAuth() && isAuth().role === 1) {
    createBlogEndPoint = `http://localhost:8000/api/blog`;
  } else if (isAuth() && isAuth().role === 0) {
    createBlogEndPoint = `http://localhost:8000/api/user/blog`
  }
      
  //url match the end point in our backend
  return fetch(`${createBlogEndPoint}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: blog,
  })
    .then((response) => {
      handleResponse(response);
      return response.json();
    })
    .catch((err) => console.log(err));
};

//List Blogs with Categories and Tags -- all the params
export const listBlogsWithCategoriesAndTags = (skip, limit) => {
  const data = { limit, skip };

  //url match the end point in our backend
  return fetch(`http://localhost:8000/api/blogs-categories-tags`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

//Grab the single blog
export const getSingleBlog = (slug) => {
  return fetch(`http://localhost:8000/api/blog/${slug}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

//List the related blogs
export const listRelatedBlogs = (blog) => {
  //url match the end point in our backend
  return fetch(`http://localhost:8000/api/blogs/related`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(blog),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

//List the blogs of admin
export const listBlogs = (username) => {

  let listBlogEndPoint;
  
  if (username) {
    listBlogEndPoint = `http://localhost:8000/api/${username}/blogs`;
  } else {
    listBlogEndPoint = `http://localhost:8000/api/blogs`;
  }

  return fetch(`${listBlogEndPoint}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

//remove the blog
export const removeBlog = (slug, token) => {
  let deleteBlogEndPoint;
  
  if (isAuth() && isAuth().role === 1) {
    deleteBlogEndPoint = `http://localhost:8000/api/blog/${slug}`;
  } else if (isAuth() && isAuth().role === 0) {
    deleteBlogEndPoint = `http://localhost:8000/api/user/blog/${slug}`
  }
  //url match the end point in our backend
  return fetch(`${deleteBlogEndPoint}`, {
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

//update blog
export const updateBlog = (blog, token, slug) => {

  let updateBlogEndPoint;
  
  if (isAuth() && isAuth().role === 1) {
    updateBlogEndPoint = `http://localhost:8000/api/blog/${slug}`;
  } else if (isAuth() && isAuth().role === 0) {
    updateBlogEndPoint = `http://localhost:8000/api/user/blog/${slug}`
  }

  //url match the end point in our backend
  return fetch(`${updateBlogEndPoint}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: blog,
  })
    .then((response) => {
      handleResponse(response);
      return response.json();
    })
    .catch((err) => console.log(err));
};

//search the blogs
export const listSearch = (params) => {
  let query = queryString.stringify(params);

  return fetch(`http://localhost:8000/api/blogs/search?${query}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
