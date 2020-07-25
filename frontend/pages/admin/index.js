import Layout from "../../components/Layout";
import Link from "next/link";
import Admin from "../../components/auth/Admin";

const AdminIndex = () => {
  return (
    <Layout>
      <Admin>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>Admin Dashboard</h2>
            </div>
            <div className="col-md-4">
              <ul className="list-group">
                <li className="list-group-item">
                  <Link href="user/update">
                    <a>Update Profile</a>
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link href="admin/crud/category-tag">
                    <a>Create a Category</a>
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link href="admin/crud/category-tag">
                    <a>Create a Tag</a>
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link href="admin/crud/blog">
                    <a>Create a Blog</a>
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link href="admin/crud/blogs">
                    <a>Update/Delete Blogs</a>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-md-8">right</div>
          </div>
        </div>
      </Admin>
    </Layout>
  );
};

export default AdminIndex;
