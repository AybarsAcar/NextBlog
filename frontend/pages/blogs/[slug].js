import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import { getSingleBlog, listRelatedBlogs } from "../../actions/blog";
import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../../config";
import { withRouter } from "next/router";
import moment from "moment";
import renderHTML from "react-render-html";
import SmallCard from "../../components/blog/SmallCard";
import DisqusThread from "../../components/DisqusThread";

const SingleBlog = (props) => {
  const { router, blog } = props;

  //
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    loadRelatedBlogs();
  }, []);

  const loadRelatedBlogs = () => {
    listRelatedBlogs({ blog }).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setRelatedBlogs(data);
      }
    });
  };

  //function to return the unique head for SOE dynamically for the Blog
  const head = () => (
    <Head>
      <title>
        {blog.title} | {APP_NAME}
      </title>
      <meta name="description" content={blog.mdesc} />
      <link rel="canonical" href={`${DOMAIN}/blogs/${router.pathname}`} />
      <meta property="og:title" content={`${blog.title} | ${APP_NAME}`} />
      <meta property="og:description" content={blog.mdesc} />
      <meta property="og:type" content="website" />
      <meta property="og:type" content={`${DOMAIN}/blogs/${router.pathname}`} />
      <meta property="og:site_name" content={`${APP_NAME}`} />

      <meta property="og:image" content={`${API}/blog/photo/${blog.photo}`} />
      <meta
        property="og:image:secure_url"
        content={`${API}/blog/photo/${blog.photo}`}
      />
      <meta property="og:image:type" content="img/png" />
      <meta property="fb:app_id" content={`${FB_APP_ID}`} />
    </Head>
  );

  const showBlogCategories = () => {
    return blog.categories.map((c) => (
      <Link key={c._id} href={`/categories/${c.slug}`}>
        <a className="btn btn-sm btn-info mr-1 ml-1 mt-3">{c.name}</a>
      </Link>
    ));
  };
  const showBlogTags = () => {
    return blog.tags.map((t, i) => (
      <Link key={i} href={`/tags/${t.slug}`}>
        <a className="btn btn-sm btn-outline-info mr-1 ml-1 mt-3">{t.name}</a>
      </Link>
    ));
  };

  const showRelatedBlogs = () => {
    return (
      relatedBlogs &&
      relatedBlogs.map((b, i) => (
        <div key={i} className="col-md-4">
          <article>
            <SmallCard blog={b} />
          </article>
        </div>
      ))
    );
  };

  const showComments = () => {
    return (
      <div>
        <DisqusThread id={blog._id} title={blog.title} path={`/blog/${blog.slug}`} />
      </div>
    )
  }

  return (
    <>
      {head()}
      <Layout>
        <main>
          <article>
            <div className="container-fluid">
              <section>
                <div className="row" style={{ marginTop: "-30px" }}>
                  <img
                    src={`http://localhost:8000/api/blog/photo/${blog.slug}`}
                    alt={blog.title}
                    className="img text-center img-fluid featured-image"
                  />
                </div>
              </section>
              <section>
                <div className="container">
                  <h1 className="display-2 pb-3 pt-3 text-center font-weight-bold">
                    {blog.title}
                  </h1>
                  <p className="lead mt-3 mark text-center">
                    written by{" "}
                    <Link href={`/profile/${blog.postedBy.username}`}>
                      <a>{blog.postedBy.name}</a>
                    </Link>{" "}
                    | published on {moment(blog.createdAt).format("LL")} | last
                    updated {moment(blog.updatedAt).fromNow()}
                  </p>
                  <div className="text-center pb-3">
                    {showBlogCategories()}
                    {showBlogTags()}
                    <br />
                    <hr />
                  </div>
                </div>
              </section>
            </div>
            <div className="container">
              <section>
                <div className="col-md-12 lead">{renderHTML(blog.body)}</div>
              </section>
            </div>
            <div className="container">
              <h4 className="text-center pt-5 pb-5 h2">Related Blogs</h4>
              <hr />
              <div className="row">{showRelatedBlogs()}</div>
            </div>
            <div className="container">
              <h4 className="text-center pt-5 pb-5 h2">Discussion</h4>
              <hr />
              {showComments()}
            </div>
          </article>
        </main>
      </Layout>
    </>
  );
};

//grab the blog info from the server
//you can grab the query from the router props // router.query
SingleBlog.getInitialProps = ({ query }) => {
  //
  return getSingleBlog(query.slug).then((data) => {
    if (data.error) {
      console.log(data.error);
    } else {
      //return the data with the name of blog
      return { blog: data, query };
    }
  });
};

export default withRouter(SingleBlog);
