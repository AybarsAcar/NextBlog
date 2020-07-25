import { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import { forgotPassword } from "../../../actions/auth";

const ForgotPassword = () => {
  const [values, setValues] = useState({
    email: "",
    message: "",
    error: "",
    showForm: true,
  });
  const { email, message, error, showForm } = values;

  const handleSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, message: "", error: "" });
    //send the email as an object
    forgotPassword({ email }).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          message: data.message,
          email: "",
          showForm: false,
        });
      }
    });
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
      error: "",
      message: "",
    });
  };

  const showError = () =>
    error && <div className="alert alert-danger">{error}</div>;
  const showMessage = () =>
    message && <div className="alert alert-success">{message}</div>;

  const passwordForgotForm = () => (
    <div className="contaienr">
      <form onSubmit={handleSubmit}>
        <div className="form-group pt-5">
          <input
            onChange={handleChange}
            type="email"
            name="email"
            value={email}
            className="form-control"
            placeholder="Enter your Email"
            required
          />
        </div>
        <div>
          <button className="btn btn-outline-dark btn-block">
            Send Password Reset Link
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <Layout>
      <div className="container">
        <h2>Forgot Password</h2>
        <hr />
        {showForm && passwordForgotForm()}
        {showError()}
        {showMessage()}
      </div>
    </Layout>
  );
};

export default ForgotPassword;