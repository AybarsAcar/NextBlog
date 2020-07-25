import Layout from "../components/Layout";
import Link from "next/link";
import SignupComponent from "../components/auth/SignupComponent";

const Signup = () => {
  return (
    <Layout>
      <h2 className="text-center p-5">Signup Page</h2>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <SignupComponent />
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
