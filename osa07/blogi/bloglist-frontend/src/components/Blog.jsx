import { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, likeBlog, removeBlog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };
  const [fullBlog, setFullBlog] = useState(false);

  const addLike = async () => {
    await likeBlog(blog);
  };

  const deleteBlog = async () => {
    await removeBlog(blog);
  };

  return (
    <div style={blogStyle} className="titleAuthor">
      {blog.title} {blog.author}{" "}
      <button id="show-blog" onClick={() => setFullBlog(!fullBlog)}>
        {fullBlog ? "hide" : "view"}
      </button>
      {fullBlog && (
        <div>
          <div className="blogUrl">{blog.url}</div>
          <div className="blogLikes">
            likes {blog.likes}{" "}
            <button onClick={addLike} id="like-button">
              like
            </button>
          </div>
          <div className="blogUser">{blog.user.name}</div>

          {user.name === blog.user.name ? (
            <button onClick={deleteBlog}>remove</button>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Blog;
