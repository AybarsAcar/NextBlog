import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import { userPublicProfile } from "../../actions/user";
import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../../config";
import { withRouter } from "next/router";
import moment from "moment";
import ContactForm from "../../components/form/ContactForm";

const UserProfile = (props) => {
  const { user, blogs, query } = props;

  //function to return the unique head for SOE dynamically for the User
  const head = () => (
    <Head>
      <title>
        {user.username} | {APP_NAME}
      </title>
      <meta name="description" content={`Blogs by ${user.username}`} />
      <link rel="canonical" href={`${DOMAIN}/profile/${query.username}`} />
      <meta property="og:title" content={`${user.name} | ${APP_NAME}`} />
      <meta property="og:description" content={user.name} />
      <meta property="og:type" content="website" />
      <meta
        property="og:type"
        content={`${DOMAIN}/profile/${query.username}`}
      />
      <meta property="og:site_name" content={`${APP_NAME}`} />

      <meta property="og:image" content={`${DOMAIN}/static/images/map.png`} />
      <meta
        property="og:image:secure_url"
        content={`${DOMAIN}/static/images/map.png`}
      />
      <meta property="og:image:type" content="img/png" />
      <meta property="fb:app_id" content={`${FB_APP_ID}`} />
    </Head>
  );

  const showUserBlogs = () => {
    return blogs.map((b, i) => (
      <div key={i} className="mt-4 mb-4">
        <Link href={`/blogs/${b.slug}`}>
          <a className="lead">{b.title}</a>
        </Link>
      </div>
    ));
  };

  return (
    <>
      {head()}
      <Layout>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-8">
                      <h3>{user.name}</h3>
                      <p className="text-muted">
                        Joined {moment(user.createdAt).fromNow()}
                      </p>
                    </div>
                    <div className="col-md-4">
                      <img
                        src={`http://localhost:8000/api/user/photo/${user.username}`}
                        className="img img-fluid img-thumbnail"
                        alt="user profile photo"
                        style={{
                          maxHeight: "10rem",
                          maxWidth: "100%",
                          borderRadius: "50%",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
        <div className="container pb-5">
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title text-light bg-info p-4">
                    Recent blogs by {user.name}
                  </h5>
                  <br />
                  {showUserBlogs()}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title bg-info p-4 text-light">
                    Contact {user.name}
                  </h5>
                  <br />
                  <ContactForm authorEmail={user.email} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

UserProfile.getInitialProps = ({ query }) => {
  return userPublicProfile(query.username).then((data) => {
    if (data.error) {
      console.log(data.error);
    } else {
      console.log(data);

      return { user: data.user, blogs: data.blogs, query };
    }
  });
};

export default UserProfile;
