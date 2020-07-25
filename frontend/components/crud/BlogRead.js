import Link from "next/link";
import { useState, useEffect } from "react";
import Router from "next/router";

//importing the actions
import { getCookie, isAuth } from "../../actions/auth";
import { listBlogs, removeBlog } from "../../actions/blog";
import moment from "moment";

const BlogRead = (props) => {
  const { username } = props;

  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState("");

  const token = getCookie("token");

  useEffect(() => {
    //load the blogs
    loadBlogs();
  }, []);

  const loadBlogs = () => {
    listBlogs(username).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setBlogs(data);
      }
    });
  };

  const deleteConfirm = (slug) => {
    let answer = window.confirm("Are you sure you want to delete your blog?");
    if (answer) {
      deleteBlog(slug);
    }
  };

  const deleteBlog = (slug) => {
    console.log(slug);

    removeBlog(slug, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setMessage(data.message);
        loadBlogs();
      }
    });
  };

  const showUpdateButton = (blog) => {
    //for normal user
    if (isAuth() && isAuth().role === 0) {
      return (
        <Link href={`/user/crud/${blog.slug}`}>
          <a className="ml-2 btn btn-sm btn-outline-warning">Update</a>
        </Link>
      );
    } else if (isAuth() && isAuth().role === 1) {
      return (
        <Link href={`/admin/crud/${blog.slug}`}>
          <a className="ml-2 btn btn-sm btn-outline-warning">Update</a>
        </Link>
      );
    }
  };

  const showAllBlogs = () => {
    return blogs.map((b, i) => (
      <div key={i} className="mb-5">
        <h3>{b.title}</h3>
        <p className="mark">
          {b.postedBy.name} | Published on {moment(b.updatedAt).fromNow()}
        </p>
        <button
          onClick={() => deleteConfirm(b.slug)}
          className="btn btn-sm btn-outline-danger"
        >
          Delete
        </button>
        {showUpdateButton(b)}
      </div>
    ));
  };

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          {message && <div className="alert alert-warning">{message}</div>}
          {showAllBlogs()}
        </div>
      </div>
    </>
  );
};

export default BlogRead;
