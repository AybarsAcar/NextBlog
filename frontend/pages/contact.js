import Layout from "../components/Layout";
import Link from "next/link";
import ContactForm from "../components/form/ContactForm";

const ContactPage = () => {
  return (
    <Layout>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <h2>Contact me</h2>
            <hr/>
            <ContactForm />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
