import Link from "next/link";
import { useState, useEffect } from "react";
import Router from "next/router";
import dynamic from "next/dynamic";
import { withRouter } from "next/router";

//importing the actions
import { getCookie, isAuth, setCookie } from "../../actions/auth";
import { getCategories } from "../../actions/category";
import { getTags } from "../../actions/tag";
import { createBlog } from "../../actions/blog";

//import react-quill dynamically
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "../../node_modules/react-quill/dist/quill.snow.css";

//import format
import { modules, formats } from "../../helpers/blogContentFormat";

const BlogCreate = ({ router }) => {
  //get blog from the localStorage
  const blogFromLS = () => {
    if (typeof window === "undefined") {
      return false;
    }
    if (localStorage.getItem("blog")) {
      return JSON.parse(localStorage.getItem("blog"));
    } else {
      return false;
    }
  };

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [checkedCategories, setCheckedCategories] = useState([]);
  const [checkedTags, setCheckedTags] = useState([]);

  const [body, setBody] = useState(blogFromLS());
  const [values, setValues] = useState({
    error: "",
    sizeError: "",
    success: "",
    formData: "",
    title: "",
    hidePublishButton: false,
  });

  const {
    error,
    sizeError,
    success,
    formData,
    title,
    hidePublishButton,
  } = values;
  const token = getCookie("token");

  //anytime the page changes we run it -- populate the state
  useEffect(() => {
    setValues({ ...values, formData: new FormData() });
    initCategories();
    initTags();
  }, [router]);

  const initCategories = () => {
    //api requests
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setCategories(data);
      }
    });
  };

  const initTags = () => {
    //api requests
    getTags().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setTags(data);
      }
    });
  };

  const publishBlog = (e) => {
    e.preventDefault();
    //send the formData and the token
    createBlog(formData, token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          title: "",
          error: "",
          success: `A new blog titled "${data.title}" is created`,
        });
        setBody(""); //it also clears the localStorage as well
        setCategories([]);
        setTags([]);
      }
    });
  };

  const handleChange = (e) => {
    const value =
      e.target.name === "photo" ? e.target.files[0] : e.target.value;
    //populate the form data
    formData.set(e.target.name, value);
    setValues({ ...values, [e.target.name]: value, formData, error: "" });
  };

  const handleBody = (e) => {
    //
    setBody(e);
    formData.set("body", e);
    //save that onto localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("blog", JSON.stringify(e));
    }
  };

  const handleToggleC = (c) => () => {
    setValues({ ...values, error: "" });
    const clickedCategory = checkedCategories.indexOf(c);
    const all = [...checkedCategories];

    if (clickedCategory === -1) {
      all.push(c);
    } else {
      all.splice(clickedCategory, 1);
    }
    setCheckedCategories(all);
    formData.set("categories", all);
  };

  const handleToggleT = (t) => () => {
    setValues({ ...values, error: "" });
    const clickedTag = checkedTags.indexOf(t);
    const all = [...checkedTags];

    if (clickedTag === -1) {
      all.push(t);
    } else {
      all.splice(clickedTag, 1);
    }
    setCheckedTags(all);
    formData.set("tags", all);
  };

  const showCategories = () => {
    return (
      categories &&
      categories.map((c, i) => (
        <li key={i} className="list-unstyled">
          <input
            onChange={handleToggleC(c._id)}
            type="checkbox"
            className="mr-2"
          />
          <label className="form-check-label">{c.name}</label>
        </li>
      ))
    );
  };

  const showTags = () => {
    return (
      tags &&
      tags.map((t, i) => (
        <li key={i} className="list-unstyled">
          <input
            onChange={handleToggleT(t._id)}
            type="checkbox"
            className="mr-2"
          />
          <label className="form-check-label">{t.name}</label>
        </li>
      ))
    );
  };

  const showError = () => (
    <div
      style={{ display: error ? "" : "none" }}
      className="alert alert-danger mt-3"
    >
      {error}
    </div>
  );
  const showSuccess = () => (
    <div
      style={{ display: success ? "" : "none" }}
      className="alert alert-success mt-3"
    >
      {success}
    </div>
  );

  const createBlogForm = () => {
    return (
      <form onSubmit={publishBlog}>
        <div className="form-group">
          <label className="text-muted">Title</label>
          <input
            type="text"
            placeholder="Enter a title"
            className="form-control"
            name="title"
            value={title}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Content</label>
          <ReactQuill
            modules={modules}
            formats={formats}
            value={body}
            placeholder="Enter your content here"
            onChange={handleBody}
          />
        </div>
        <div>
          <button
            type="submit"
            style={{ display: "block", width: "100%" }}
            className="btn btn-outline-dark mb-5"
          >
            Publish
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-8">
          {createBlogForm()}
          {showError()}
          {showSuccess()}
        </div>
        <div className="col-md-4">
          <div>
            <div className="form-group pb-2">
              <h5>Featured Image</h5> <hr />
              <small className="text-muted">Max Size: 1mb</small>
              <br />
              <label className="btn btn-outline-info">
                Upload featured image
                <input
                  onChange={handleChange}
                  name="photo"
                  type="file"
                  accept="image/*"
                  hidden={true}
                />
              </label>
            </div>
          </div>
          <div>
            <h5>Categories</h5> <hr />
            <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
              {showCategories()}
            </ul>
          </div>
          <div>
            <h5>Tags</h5> <hr />
            <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
              {showTags()}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(BlogCreate);
