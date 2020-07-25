import { useEffect } from "react";
import Router from "next/router";
import { isAuth } from "../../actions/auth";

const Admin = (props) => {
  //check the authentication first
  useEffect(() => {
    if (!isAuth()) {
      Router.push("/signin");
    } else if (isAuth(). role !== 1) {
      Router.push("/");
    }
  }, []);

  return <>{props.children}</>;
};

export default Admin;
