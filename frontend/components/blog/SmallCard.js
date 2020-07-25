import moment from "moment";
import renderHTML from "react-render-html";
import Link from "next/link";
import { API } from "../../config";

const SmallCard = (props) => {
  const { blog } = props;

  return (
    <div className="card">
      <section>
        <Link href={`/blogs/${blog.slug}`}>
          <a>
            <img
              className="img img-fluid"
              style={{ height: "250px", width: "100%" }}
              src={`http://localhost:8000/api/blog/photo/${blog.slug}`}
              alt={blog.title}
            />
          </a>
        </Link>
      </section>

      <div className="card-body">
        <section>
          <Link href={`/blogs/${blog.slug}`}>
            <h5 className="card-title">{blog.title}</h5>
          </Link>
          <p className="card-text">{renderHTML(blog.excerpt)}</p>
        </section>
      </div>
      <div className="card-body">
        <Link href={`/blogs/${blog.slug}`}>
          <a className="btn btn-sm btn-outline-dark">Read More</a>
        </Link>
        <div className="mt-3">
          Posted {moment(blog.updatedAt).fromNow()} by{" "}
          <Link href={`/profile/${blog.postedBy.username}`}>
            <a>{blog.postedBy.name}</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SmallCard;
