import Layout from "../components/Layout";
import SigninComponent from "../components/auth/SigninComponent";
import { withRouter } from "next/router";

const Signin = (props) => {
  const { router } = props;

  const showMessage = () => {
    if (router.query.message) {
      return (
        <div className="alert alert-danger">
          {router.query.message}
        </div>
      )
    }
  }

  return (
    <Layout>
      <h2 className="text-center p-5">Signin Page</h2>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <SigninComponent />
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-md-6 offset-md-3">
          {showMessage()}
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(Signin);
