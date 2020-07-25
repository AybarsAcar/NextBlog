import { useEffect } from "react";
import Router from "next/router";
import { isAuth } from "../../actions/auth";

const Private = (props) => {
  //check the authentication first
  useEffect(() => {
    if (!isAuth()) {
      Router.push("/signin");
    }
  }, []);

  return <>{props.children}</>;
};

export default Private;
