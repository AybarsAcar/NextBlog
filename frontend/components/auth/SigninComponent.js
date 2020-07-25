import { useState, useEffect } from "react";
import { signin, authenticate, isAuth } from "../../actions/auth";
import Router from "next/router";
import Link from "next/link";
import Google from "./social_login/Google";
import Facebook from "./social_login/Facebook";

const SigninComponent = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    loading: false,
    message: "",
    showForm: true,
  });

  const { email, password, error, loading, message, showForm } = values;

  //redirect auth users
  useEffect(() => {
    isAuth() && Router.push(`/`);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, loading: true, error: false });
    const user = { email, password };

    signin(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        //save user token to cookie
        //save user info to localstorage
        //authenticate the user
        //redirect to the home page
        authenticate(data, () => {
          isAuth() && isAuth().role === 1
            ? Router.push(`/admin`)
            : Router.push(`/user`);
        });
      }
    });
  };

  const handleChange = (e) => {
    setValues({ ...values, error: false, [e.target.name]: e.target.value });
  };

  const showLoading = () =>
    loading && <div className="mt-3 alert alert-info">Loading...</div>;

  const showError = () =>
    error && <div className="mt-3 alert alert-danger">{error}</div>;

  const showMessage = () =>
    message && <div className="mt-3 alert alert-ingo">{message}</div>;

  const signinForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            onChange={handleChange}
            name="email"
            value={email}
            type="email"
            className="form-control"
            placeholder="Email"
          />
        </div>
        <div className="form-group">
          <input
            onChange={handleChange}
            name="password"
            value={password}
            type="password"
            className="form-control"
            placeholder="Password"
          />
        </div>
        <div>
          <button className="btn btn-primary">Sign in</button>
        </div>
      </form>
    );
  };

  return (
    <>
      <Google />
      <Facebook />
      <hr />
      {signinForm()}
      <br />
      <Link href="/auth/password/forgot">
        <a className="text-muted">Forgot Password?</a>
      </Link>
      {showError()}
      {showLoading()}
      {showForm && showMessage()}
    </>
  );
};

export default SigninComponent;
