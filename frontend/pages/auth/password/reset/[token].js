import { useState } from "react";
import Layout from "../../../../components/Layout";
import { withRouter } from "next/router";
import { resetPassword } from "../../../../actions/auth";

const ResetPassword = (props) => {
  const { router } = props;

  const [values, setValues] = useState({
    name: "",
    newPassword: "",
    error: "",
    message: "",
    showForm: true,
  });
  const { name, newPassword, message, error, showForm } = values;

  const handleSubmit = (e) => {
    e.preventDefault();
    resetPassword({
      newPassword,
      resetPasswordLink: router.query.token,
    }).then((data) => {
      if (data.error) {
        setValues({
          ...values,
          error: data.error,
          showForm: false,
          newPassword: "",
        });
      } else {
        setValues({
          ...values,
          message: data.message,
          showForm: false,
          newPassword: "",
          error: false,
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

  const passwordResetForm = () => (
    <div className="contaienr">
      <form onSubmit={handleSubmit}>
        <div className="form-group pt-5">
          <input
            onChange={handleChange}
            type="text"
            name="newPassword"
            value={newPassword}
            className="form-control"
            placeholder="Enter your new Password"
            required
          />
        </div>
        <div>
          <button className="btn btn-outline-dark btn-block">
            Change Password
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <Layout>
      <div className="container">
        <h2>Reset Password</h2>
        <hr />
        {showForm && passwordResetForm()}
        {showError()}
        {showMessage()}
      </div>
    </Layout>
  );
};

export default withRouter(ResetPassword);
