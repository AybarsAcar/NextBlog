import { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import Layout from "../../../../components/Layout";
import { withRouter } from "next/router";
import { signup } from "../../../../actions/auth";

const ActivateAccount = (props) => {

  const {router} = props;

  const [values, setValues] = useState({
    name: "",
    token: "",
    error: "",
    loading: false,
    success: false,
    showButton: true,
  });
  const { name, token, error, loading, success, showButton } = values;

  //set the token and the name
  useEffect(() => {
    let token = router.query.token;
    console.log(token);
    
    //if token decode it
    if (token) {
      const { name } = jwt.decode(token);
      setValues({ ...values, name, token });
    }
  }, []);

  const clickSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, loading: true, error: false });

    //make request to the signup endpoint
    signup({ token }).then((data) => {
      if (data.error) {
        setValues({
          ...values,
          error: data.error,
          loading: false,
          showButton: false,
        });
      } else {
        setValues({
          ...values,
          loading: false,
          success: true,
          showButton: false,
        });
      }
    });
  };

  const showLoading = () => loading && <h2>Loading...</h2>;

  return (
    <Layout>
      <div className="container">
        <h3>Hey {name}, use the link below to activate the account</h3>
        {showLoading()}
        {error && error}
        {success &&
          "You have successfully activated your account. You can now sign in"}
        {showButton && (
          <button onClick={clickSubmit} className="btn btn-outline-primary">
            Activate Your Account
          </button>
        )}
      </div>
    </Layout>
  );
};

export default withRouter(ActivateAccount);
