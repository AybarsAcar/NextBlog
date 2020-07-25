//google login client side
import Link from "next/link";
import { useState, useEffect } from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { FB_APP_ID } from "../../../config";
import { loginWithFacebook, authenticate, isAuth } from "../../../actions/auth";
import Router from "next/router";
import axios from "axios";

const Facebook = (props) => {

  const responseFacebook = (response) => {
    console.log(response);
    const accessToken = response.accessToken
    const userID = response.userID

    const userInfo = {accessToken, userID};

    loginWithFacebook(userInfo).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        //authenticate to save the user info in the db
        authenticate(data, () => {
          isAuth() && isAuth().role === 1
            ? Router.push(`/admin`)
            : Router.push(`/user`);
        });
      }
    })
  }

  return (
    <div className="pb-3">
      <FacebookLogin
        appId={`${FB_APP_ID}`}
        autoLoad={false}
        callback={responseFacebook}
        render={(renderProps) => (
          <button
            style={{ display: "block", width: "100%" }}
            className="btn btn-outline-primary btn-lg"
            onClick={renderProps.onClick}
          >
            <i className="pr-3 fab fa-facebook-f"></i>Login with Facebook
          </button>
        )}
      />
    </div>
  );
};

export default Facebook;
