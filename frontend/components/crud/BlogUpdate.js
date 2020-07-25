import Link from "next/link";
import { useState, useEffect } from "react";
import Router from "next/router";
import dynamic from "next/dynamic";
import { withRouter } from "next/router";

//importing the actions
import { getCookie, isAuth, setCookie } from "../../actions/auth";
import { getCategories } from "../../actions/category";
import { getTags } from "../../actions/tag";
import { getSingleBlog, updateBlog } from "../../actions/blog";

//import react-quill dynamically
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "../../node_modules/react-quill/dist/quill.snow.css";

//import format
import { modules, formats } from "../../helpers/blogContentFormat";

const BlogUpdate = (props) => {

  const token = getCookie("token");

  const {router} = props;

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [checkedCategories, setCheckedCategories] = useState([]);
  const [checkedTags, setCheckedTags] = useState([]);

  const [body, setBody] = useState("");
  const [values, setValues] = useState({
    error: "",
    success: "",
    formData: "",
    title: "",
  });

  const {error, success, formData, title} = values;


  //fetch the blog data
  useEffect(() => {
    console.log(router.query.slug)
    setValues({...values, formData: new FormData()})
    initBlog();
    initCategories();
    initTags();
  },[router]);

  const initBlog = (slug) => {
    //make sure you have the slug
    if (router.query.slug) {
      getSingleBlog(router.query.slug).then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
          setValues({...values, title: data.title});
          setBody(data.body)
          // console.log(blog);
          setCategoriesArray(data.categories);
          setTagsArray(data.tags);
        }
      })
    }
  }

  const setCategoriesArray = (blogCategories) => {
    let ca = [];
    blogCategories.map((c, i) => {
      ca.push(c._id)
    })
    setCheckedCategories(ca)
  }

  const setTagsArray = (blogTags) => {
    let ta = [];
    blogTags.map((t, i) => {
      ta.push(t._id)
    })
    setCheckedTags(ta)
  }

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

  const isCheckedCat = c => {
    const result = checkedCategories.indexOf(c);
    return result !== -1;
  }

  const isCheckedTag = t => {
    const result = checkedTags.indexOf(t);
    return result !== -1;
  }

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

  const showCategories = () => {
    return (
      categories &&
      categories.map((c, i) => (
        <li key={i} className="list-unstyled">
          <input
            onChange={handleToggleC(c._id)}
            type="checkbox"
            checked={isCheckedCat(c._id)}
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
            checked={isCheckedTag(t._id)}
            type="checkbox"
            className="mr-2"
          />
          <label className="form-check-label">{t.name}</label>
        </li>
      ))
    );
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

  const handleChange = (e) => {
    const value =
      e.target.name === "photo" ? e.target.files[0] : e.target.value;
    //populate the form data
    formData.set(e.target.name, value);
    setValues({ ...values, [e.target.name]: value, formData, error: "" });
  };

  const handleBody = (e) => {
    //for rich text editor we pass the whole event
    setBody(e);
    //update the form data as well // name body and value e
    formData.set("body", e);
  }

  //make the request to the backend
  const editBlog = (e) => {
    e.preventDefault();
    updateBlog(formData, token, router.query.slug).then(data => {
      if (data.error) {
        setValues({...values, error: data.error})
      } else {
        setValues({...values, title: "", success: `Blog titled "${data.title}" has successfully been updated`});
        if (isAuth() && isAuth().role === 1) {
          Router.replace(`/admin`)
        } else if (isAuth() && isAuth().role === 0) {
          Router.replace(`/user`)
        }
      }
    })
  }

  const showError = () => (
    <div className="alert alert-danger" style={{display: error ? "" : "none"}}>
      {error}
    </div>
  )
  const showSuccess = () => (
    <div className="alert alert-success" style={{display: success ? "" : "none"}}>
      {success}
    </div>
  )

  const updateBlogForm = () => {
    return (
      <form onSubmit={editBlog}>
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
            Update
          </button>
        </div>
      </form>
    );
  };

  return(
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-8">
          {updateBlogForm()}
          <div >
            {showSuccess()}
            {showError()}
          </div>
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
              <span>
              {body &&  <img className="ml-2" src={`http://localhost:8000/api/blog/photo/${router.query.slug}`}
                alt= {title}
                style={{maxWidth: "10em", borderRadius: "3px"}}
                 />}
              </span>
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
  )
}

export default withRouter(BlogUpdate);