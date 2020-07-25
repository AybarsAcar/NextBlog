import Link from "next/link";
import { useState, useEffect } from "react";
import Router from "next/router";
import { getCookie, isAuth, updateUser } from "../../actions/auth";
import { getProfile, updateProfile } from "../../actions/user";

const ProfileUpdate = () => {
  const token = getCookie("token");

  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [showPassword, setShowPassword] = useState("password");

  const [values, setValues] = useState({
    username: "",
    usernameForPhoto: "",
    name: "",
    email: "",
    password: "",
    error: false,
    success: false,
    loading: false,
    photo: "",
    userData: process.browser && new FormData(),
    about: "",
  });

  const {
    username,
    name,
    email,
    password,
    error,
    success,
    loading,
    userData,
    photo,
    usernameForPhoto,
    about,
  } = values;

  //get user info
  useEffect(() => {
    init();
    setValues({ ...values, userData: new FormData() });
  }, []);

  const init = () => {
    getProfile(token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          username: data.username,
          usernameForPhoto: data.username,
          name: data.name,
          email: data.email,
          about: data.about,
        });
      }
    });
  };

  const handleChange = (e) => {
    const value =
      e.target.name === "photo" ? e.target.files[0] : e.target.value;
    //populate the form data
    userData.set(e.target.name, value);
    setValues({
      ...values,
      [e.target.name]: value,
      userData,
      error: false,
      success: false,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, loading: true });
    updateProfile(token, userData).then((data) => {
      if (data.error) {
        setValues({
          ...values,
          error: data.error,
          success: false,
          loading: false,
        });
      } else {
        updateUser(data, () => {
          setValues({
            ...values,
            username: data.username,
            name: data.name,
            email: data.email,
            about: data.about,
            password: "",
            success: true,
            loading: false,
          });
        });
      }
    });
  };

  const togglePasswordInput = () => {
    setShowPasswordInput(!showPasswordInput);
  };

  const handleShowPassword = () => {
    setShowPassword("text");
  };
  const handleHidePassword = () => {
    setShowPassword("password");
  };

  //create the form wiht the user info
  const profileUpdateForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <div>
          <label className="btn btn-outline-dark btn-block">
          <i class="mr-3 fas fa-camera-retro"/>Upload Profile Photo
            <input
              onChange={handleChange}
              name="photo"
              type="file"
              accept="image/*"
              className="form-control"
              hidden
            />
          </label>
        </div>
      </div>
      <div className="form-group">
        <label className="text-muted">Username</label>
        <input
          onChange={handleChange}
          name="username"
          value={username}
          type="text"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange}
          name="name"
          value={name}
          type="text"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={handleChange}
          name="email"
          value={email}
          type="email"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">About</label>
        <textarea
          onChange={handleChange}
          name="about"
          value={about}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <div>
          <button
          type="button"
            onClick={togglePasswordInput}
            className="btn btn-outline-dark btn-block mb-3"
          >
            Update Password
          </button>
        </div>
        {showPasswordInput && (
          <>
            <label className="text-muted">Password</label>
            <div className="input-group">
              <input
                onChange={handleChange}
                name="password"
                value={password}
                type={showPassword}
                className="form-control"
              />
              {showPassword === "password" ? (
                <span
                  onClick={handleShowPassword}
                  className="btn btn-outline-danger"
                  style={{borderRadius: "0 5px 5px 0", minWidth: "10rem"}}
                >
                  Show Password
                </span>
              ) : (
                <span
                  onClick={handleHidePassword}
                  className="btn btn-outline-success"
                  style={{borderRadius: "0 5px 5px 0", minWidth: "10rem"}}
                >
                  Hide Password
                </span>
              )}
            </div>
          </>
        )}
      </div>
      <div>
        <button type="submit" className="btn btn-dark btn-block">
          Confirm
        </button>
      </div>
    </form>
  );

  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );
  const showSuccess = () => (
    <div
      className="alert alert-success"
      style={{ display: success ? "" : "none" }}
    >
      Profile Successfully Updated
    </div>
  );
  const showLoading = () => (
    <div className="alert alert-info" style={{ display: error ? "" : "none" }}>
      Loading ...
    </div>
  );

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <img
              src={`http://localhost:8000/api/user/photo/${usernameForPhoto}`}
              className="img img-fluid img-thumbnail"
              alt="user profile photo"
              style={{
                maxHeight: "auto",
                maxWidth: "100%",
                borderRadius: "50%",
              }}
            />
          </div>
          <div className="col-md-8 mb-5">
            {profileUpdateForm()}
            <div className="mt-3 text-center">
              {showError()}
              {showSuccess()}
              {showLoading()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileUpdate;
