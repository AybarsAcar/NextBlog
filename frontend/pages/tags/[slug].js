//category page
import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import { singleTag } from "../../actions/tag";
import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../../config";
import { withRouter } from "next/router";
import moment from "moment";
import renderHTML from "react-render-html";
import Card from "../../components/blog/Card";

const Tags = (props) => {
  const { tag, blogs, query } = props;

  //function to return the unique head for SOE dynamically for the Blog
  const head = () => (
    <Head>
      <title>
        {tag.name} | {APP_NAME}
      </title>
      <meta
        name="description"
        content={`Best Programming BLogs on ${tag.name}`}
      />
      <link rel="canonical" href={`${DOMAIN}/tags/${query.slug}`} />
      <meta property="og:title" content={`${tag.name} | ${APP_NAME}`} />
      <meta
        property="og:description"
        content={`Best Programming BLogs on ${tag.name}`}
      />
      <meta property="og:type" content="website" />
      <meta property="og:type" content={`${DOMAIN}/tags/${query.slug}`} />
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

  return (
    <>
      {head()}
      <Layout>
        <main>
          <div className="container-fluid text-center">
            <header>
              <div className="col-md-12 pt-3">
                <h1 className="display-4 font-weight-bold">{tag.name}</h1>
                {blogs.map((b, i) => (
                  <div>
                    <Card key={i} blog={b} />
                    <hr />
                  </div>
                ))}
              </div>
            </header>
          </div>
        </main>
      </Layout>
    </>
  );
};

//grab the router query
Tags.getInitialProps = ({ query }) => {
  return singleTag(query.slug).then((data) => {
    if (data.error) {
      console.log(data.error);
    } else {
      //return the data with the category
      return { tag: data.tag, blogs: data.blogs, query };
    }
  });
};

export default Tags;
