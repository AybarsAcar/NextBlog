//this is the blog update page
import Layout from "../../../components/Layout";
import Link from "next/link";
import Private from "../../../components/auth/Private";
import BlogUpdate from "../../../components/crud/BlogUpdate"

const UserUpdateBlog = () => {
  return (
    <Layout>
      <Private>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>Update Blog</h2>
            </div>
            <div className="col-md-12">
              <BlogUpdate />
            </div>
          </div>
        </div>
      </Private>
    </Layout>
  );
};

export default UserUpdateBlog;
