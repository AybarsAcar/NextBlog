import moment from "moment";
import renderHTML from "react-render-html";
import Link from "next/link";
import { API } from "../../config";

const Card = (props) => {
  const { blog } = props;

  const showBlogCategories = (blog) => {
    return blog.categories.map((c, i) => (
      <Link key={i} href={`/categories/${c.slug}`}>
        <a className="btn btn-sm btn-outline-info mr-1 ml-1 mt-3">{c.name}</a>
      </Link>
    ));
  };
  const showBlogTags = (blog) => {
    return blog.tags.map((t, i) => (
      <Link key={i} href={`/tags/${t.slug}`}>
        <a className="btn btn-sm btn-outline-secondary mr-1 ml-1 mt-3">
          {t.name}
        </a>
      </Link>
    ));
  };

  return (
    <div className="lead pb-4">
      <header>
        <Link href={`/blogs/${blog.slug}`}>
          <a>
            <h2 className="pt-3 pb-3 font-weight-bold">{blog.title}</h2>
          </a>
        </Link>
      </header>
      <section>
        <p className="mark pl-1 pt-2 pb-2">
          written by <Link href={`/profile/${blog.postedBy.username}`}><a>{blog.postedBy.name}</a></Link> | published on{" "}
          {moment(blog.createdAt).format("LL")} | last updated{" "}
          {moment(blog.updatedAt).fromNow()}
        </p>
      </section>
      <section>
        <p>
          {showBlogCategories(blog)}
          {showBlogTags(blog)}
          <br />
        </p>
      </section>
      <div className="row">
        <div className="col-md-4">
          <section>
            <img
              className="img img-fluid"
              style={{ maxHeight: "150px", width: "100%", maxHeight: "auto" }}
              src={`http://localhost:8000/api/blog/photo/${blog.slug}`}
              alt={blog.title}
            />
          </section>
        </div>
        <div className="col-md-8">
          <section>
            <div className="pb-3">{renderHTML(blog.excerpt)}</div>
            <Link href={`/blogs/${blog.slug}`}>
              <a className="btn btn-outline-primary pt-2">Read more</a>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Card;
