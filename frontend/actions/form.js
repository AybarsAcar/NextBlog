import fetch from "isomorphic-fetch";
import { API } from "../config";

//Create a Blog Method
export const emailContactForm = (data) => {
  let emailEndPoint;
  console.log(data);
  
  
  if (data.authorEmail) {
    emailEndPoint = `http://localhost:8000/api/contact-blog-author`;
  } else {
    emailEndPoint = `http://localhost:8000/api/contact`;
  }
      
  //url match the end point in our backend
  return fetch(`${emailEndPoint}`, {
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
