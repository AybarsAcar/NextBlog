import { useState } from "react";
import Link from "next/link";
import { emailContactForm } from "../../actions/form";

const ContactForm = (props) => {

  const {authorEmail} = props;

  const [values, setValues] = useState({
    message: "",
    name: "",
    email: "",
    sent: false,
    buttonText: "Send a Message",
    success: false,
    error: false,
  });
  const { message, name, email, sent, buttonText, success, error } = values;

  const handleSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, buttonText: "Sending..." });
    emailContactForm({ authorEmail ,name, email, message }).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          sent: true,
          name: "",
          email: "",
          message: "",
          buttonText: "Successfully Sent!",
          success: data.success,
        });
      }
    });
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
      error: false,
      success: false,
      buttonText: "Send a Message",
    });
  };

  const showSuccessMessage = () =>
    success && (
      <div className="alert alert-success">Thanks you for contacting us</div>
    );

  const showErrorMessage = () =>
    error && <div className="alert alert-danger">{error}</div>;

  const contactForm = () => (
    <form onSubmit={handleSubmit} className="pb-5 pt-3">
      <div className="form-group">
        <label className="lead">Message</label>
        <textarea
          onChange={handleChange}
          name="message"
          value={message}
          type="text"
          rows="10"
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label className="lead">Name</label>
        <input
          onChange={handleChange}
          name="name"
          value={name}
          type="text"
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label className="lead">Email</label>
        <input
          onChange={handleChange}
          name="email"
          value={email}
          type="email"
          className="form-control"
          required
        />
      </div>
      <div>
        <button className="btn btn-outline-success btn-block">
          {buttonText}
        </button>
      </div>
    </form>
  );

  return (
    <>
      {contactForm()}
      {showErrorMessage()}
      {showSuccessMessage()}
    </>
  );
};

export default ContactForm;
