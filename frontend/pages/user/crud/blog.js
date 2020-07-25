import Layout from "../../../components/Layout";
import Link from "next/link";
import BlogCreate from "../../../components/crud/BlogCreate"
import Private from "../../../components/auth/Private";

const UserBlog = () => {
  return (
    <Layout>
      <Private>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>Create a New Blog</h2>
            </div>
            <div className="col-md-12">
              <BlogCreate />
            </div>
          </div>
        </div>
      </Private>
    </Layout>
  );
};

export default UserBlog;
