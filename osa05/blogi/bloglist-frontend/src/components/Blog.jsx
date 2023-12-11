import { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, likeBlog, removeBlog }) => {
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
    // await blogService.remove(blog);
  };

  return (
    <div style={blogStyle} className="titleAuthor">
      {blog.title} {blog.author}{" "}
      <button onClick={() => setFullBlog(!fullBlog)}>
        {fullBlog ? "hide" : "view"}
      </button>
      {fullBlog && (
        <div>
          <div className="blogUrl">{blog.url}</div>
          <div className="blogLikes">
            likes {blog.likes} <button onClick={addLike}>like</button>
          </div>
          <div className="blogUser">{blog.user.name}</div>
          <button onClick={deleteBlog}>remove</button>
        </div>
      )}
    </div>
  );
};

export default Blog;
