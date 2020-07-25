//google login client side
import Link from "next/link";
import { useState, useEffect } from "react";
import GoogleLogin from "react-google-login";
import { loginWithGoogle, authenticate, isAuth } from "../../../actions/auth";
import { GOOGLE_CLIENT_ID } from "../../../config";
import Router from "next/router";

const Google = (props) => {

  const responseGoogle = (response) => {
    // console.log(response);
    const tokenId = response.tokenId;

    const user = {tokenId: tokenId};

    //request to the backend
    loginWithGoogle(user).then(data => {
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
    
  };

  return (
    <div className="pb-3">
      <GoogleLogin
        clientId={`${GOOGLE_CLIENT_ID}`}
        buttonText="Login with Google"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={"single_host_origin"}
        render={(renderProps) => (
          <button
            style={{ display: "block", width: "100%" }}
            className="btn btn-outline-danger btn-lg"
             onClick={renderProps.onClick} disabled={renderProps.disabled}>
            <i class="pr-3 fab fa-google"></i> Login with Google
          </button>
        )}
      />
    </div>
  );
};

export default Google;
