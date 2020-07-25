import { useState, useEffect } from "react";
import renderHTML from "react-render-html";
import Link from "next/link";
import { listSearch } from "../../actions/blog";

const Search = () => {
  const [values, setValues] = useState({
    search: "",
    results: [],
    searched: false,
    message: "",
  });

  const { search, results, searched, message } = values;

  const searchSubmit = (e) => {
    e.preventDefault();
    listSearch({ search }).then((data) => {
      setValues({
        ...values,
        results: data,
        searched: true,
        message: `${data.length} blogs found`,
      });
    });
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      search: e.target.value,
      searched: false,
      results: [],
    });
  };

  const searchedBlogs = (results = []) => {
    return (
      <div className="jumbotron bg-white">
        {message && <p className="pt-4 text-muted font-italic">{message}</p>}
        {results.map((b, i) => (
          <div key={i}>
            <Link href={`/blogs/${b.slug}`}>
              <a className="text-primary">{b.title}</a>
            </Link>
          </div>
        ))}
      </div>
    );
  };

  const searchForm = () => (
    <form onSubmit={searchSubmit}>
      <div className="row">
        <div className="col-md-8">
          <input
            onChange={handleChange}
            type="search"
            className="form-control"
            placeholder="Search for Blogs"
            value={search}
          />
        </div>
        <div className="col-md-4">
          <button type="submit" className="btn btn-block btn-outline-primary">
            Search  <i className="fas fa-search" />
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <div className="container-fluid">
      <div className="pt-3 pb-5">{searchForm()}</div>
      {searched && (
        <div style={{ marginTop: "-120px", marginBottom: "-80px" }}>
          {searchedBlogs(results)}
        </div>
      )}
    </div>
  );
};

export default Search;
