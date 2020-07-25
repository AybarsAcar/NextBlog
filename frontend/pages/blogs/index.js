import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import { listBlogsWithCategoriesAndTags } from "../../actions/blog";
import Card from "../../components/blog/Card";
import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../../config";
import { withRouter } from "next/router";

const Blogs = (props) => {
  //props from the server getInitialProps
  const {
    blogs,
    categories,
    tags,
    totalBlogs,
    blogsLimit,
    blogsSkip,
    router,
  } = props;

  const [limit, setLimit] = useState(blogsLimit);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(totalBlogs);
  const [loadedBlogs, setLoadedBlogs] = useState([]);

  //function to return the unique head for SOE
  const head = () => (
    <Head>
      <title>Programming blogs | {APP_NAME}</title>
      <meta name="description" content="Programming blogs" />
      <link rel="canonical" href={`${DOMAIN}${router.pathname}`} />
      <meta
        property="og:title"
        content={`Latest web development blogs on ${APP_NAME}`}
      />
      <meta property="og:description" content="Programming blogs" />
      <meta property="og:type" content="website" />
      <meta property="og:type" content={`${DOMAIN}${router.pathname}`} />
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

  const loadMore = () => {
    let toSkip = skip + limit;
    listBlogsWithCategoriesAndTags(toSkip, limit).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setLoadedBlogs([...loadedBlogs, ...data.blogs]);
        setSize(data.size);
        setSkip(toSkip);
      }
    });
  };

  const loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        <button
          onClick={loadMore}
          className="btn btn-block btn-outline-primary btn-lg"
        >
          Load More
        </button>
      )
    );
  };

  const showAllBlogs = () => {
    return blogs.map((b, i) => (
      <article key={i}>
        <Card blog={b} />
        <hr />
      </article>
    ));
  };

  const showLoadedBlogs = () => {
    return loadedBlogs.map((b, i) => (
      <article key={i}>
        <Card blog={b} />
        <hr />
      </article>
    ));
  };

  const showAllCategories = () => {
    return categories.map((c, i) => (
      <Link key={i} href={`/categories/${c.slug}`}>
        <a className="btn btn-info mr-1 ml-1 mt-3">{c.name}</a>
      </Link>
    ));
  };
  const showAllTags = () => {
    return tags.map((t, i) => (
      <Link key={i} href={`/categories/${t.slug}`}>
        <a className="btn btn-outline-info mr-1 ml-1 mt-3">{t.name}</a>
      </Link>
    ));
  };

  return (
    <>
      {head()}
      <Layout>
        <main>
          <div className="container-fluid">
            <header>
              <div className="col-md-12 pt-3">
                <h1 className="display-4 font-weight-bold text-center">
                  Programming Blogs
                </h1>
              </div>
              <section>
                <div className="pb-5 text-center">
                  {showAllCategories()} <br />
                  {showAllTags()}
                </div>
              </section>
            </header>
          </div>
          <div className="container-fluid">{showAllBlogs()}</div>
          <div className="container-fluid">{showLoadedBlogs()}</div>
          <div className="p-3 pt-5 pb-5"> {loadMoreButton()}</div>
        </main>
      </Layout>
    </>
  );
};

//load the static page -- data matches the controller in the backend
Blogs.getInitialProps = () => {
  //
  let skip = 0;
  let limit = 4;

  return listBlogsWithCategoriesAndTags(skip, limit).then((data) => {
    if (data.error) {
      console.log(data.error);
    } else {
      return {
        blogs: data.blogs,
        categories: data.categories,
        tags: data.tags,
        totalBlogs: data.size,
        blogsLimit: limit,
        blogsSkip: skip,
      };
    }
  });
};

export default withRouter(Blogs);
