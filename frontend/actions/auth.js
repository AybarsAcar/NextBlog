import fetch from "isomorphic-fetch";
import { API } from "../config";
import cookie from "js-cookie";
import Router from "next/router";

//helper method
//we are handling token expiry error 401
export const handleResponse = (response) => {
  if (response.status === 401) {
    signout(() => {
      //now redirect them with message
      Router.push({
        pathname: "/signin",
        query: {
          message: "Your session is expired, please sign back in",
        },
      });
    });
  } else {
    return;
  }
};

//PreSignup Method
export const preSignup = (user) => {
  console.log(API);

  //url match the end point in our backend
  return fetch(`http://localhost:8000/api/pre-signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

//Signup Method
export const signup = (user) => {

  //url match the end point in our backend
  return fetch(`http://localhost:8000/api/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

//Signin Method
export const signin = (user) => {
  console.log(API);

  //url match the end point in our backend
  return fetch(`http://localhost:8000/api/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

//Signout Method
export const signout = (next) => {
  //remove cookie with the key token
  removeCookie("token");
  //remove local storage with the key user
  removeLocalStorage("user");
  next();

  //then send the request to your backend server
  return fetch("http://localhost:8000/api/signout", {
    method: "GET",
  })
    .then((response) => {
      console.log("Signed out successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};

//set cookie
export const setCookie = (key, value) => {
  //if on the client side
  if (process.browser) {
    cookie.set(key, value, {
      expires: 1,
    });
  }
};

//remove cookie
export const removeCookie = (key) => {
  //if on the client side
  if (process.browser) {
    cookie.remove(key);
  }
};

//get cookie -- make sure you return the cookie
export const getCookie = (key) => {
  //if on the client side
  if (process.browser) {
    return cookie.get(key);
  }
};

//localStorage
export const setLocalStorage = (key, value) => {
  //if on the client side
  if (process.browser) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const removeLocalStorage = (key) => {
  //if on the client side
  if (process.browser) {
    localStorage.removeItem(key);
  }
};

//authenticate the user by passing data to cookie and localStorage
//this is a middleware
export const authenticate = (data, next) => {
  //this is how we send the token from our backend
  setCookie("token", data.token);
  setLocalStorage("user", data.user);
  next();
};

//get user info from the localStorage
export const isAuth = () => {
  if (process.browser) {
    //see if the user logged in
    const cookieChecked = getCookie("token");

    //if we have a valid cookie
    if (cookieChecked) {
      if (localStorage.getItem("user")) {
        return JSON.parse(localStorage.getItem("user"));
      } else {
        return false;
      }
    }
  }
};

//updating user in the localStorage
export const updateUser = (user, next) => {
  if (process.browser) {
    if (localStorage.getItem("user")) {
      //all the info is in the auth not
      let auth = JSON.parse(localStorage.getItem("user"));

      //now update the auth variable with the new updated info
      auth = user;

      //save the updated info with the user key
      localStorage.setItem("user", JSON.stringify(auth));
      next();
    }
  }
};

//Forgot Password Method
export const forgotPassword = (email) => {

  //url match the end point in our backend
  return fetch(`http://localhost:8000/api/forgot-password`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(email),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

//Reset Password Method
export const resetPassword = (resetInfo) => {

  //url match the end point in our backend
  return fetch(`http://localhost:8000/api/reset-password`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(resetInfo),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

//Login with Google Method
export const loginWithGoogle = user => {

  //url match the end point in our backend
  return fetch(`http://localhost:8000/api/google-login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

//Login with Facebook Method
export const loginWithFacebook = (userInfo) => {

  console.log(userInfo);
  
  //url match the end point in our backend
  return fetch(`http://localhost:8000/api/facebook-login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInfo),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
}