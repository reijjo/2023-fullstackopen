import { useEffect, useId, useState } from "react";
import blogService from "../services/blogs";
import { useParams } from "react-router-dom";
import { initBlogs } from "../reducers/blogReducer";
import { useDispatch } from "react-redux";
import { v4 as uuid } from "uuid";

const Blog = ({ likeBlog, removeBlog, user }) => {
  const [blog, setBlog] = useState([]);
  const [comments, setComments] = useState("");
  const [blogCOmments, setBlogComments] = useState([]);

  const { id } = useParams();
  const dispatch = useDispatch();

  const addLike = async () => {
    await likeBlog(blog);

    dispatch(initBlogs());
  };

  // const deleteBlog = async () => {
  //   await removeBlog(blog);
  // };

  useEffect(() => {
    const getBlog = async () => {
      const blog = await blogService.getOne(id);
      setBlog(blog);
      setBlogComments(blog.comments);
    };
    getBlog();
  }, [dispatch]);

  if (!user || !blog || !blog.user || !blog.user.name) {
    return null;
  }

  const addComment = async (event) => {
    event.preventDefault();
    const newComm = await blogService.comment(id, comments);
    console.log("newcom", newComm);
    setBlogComments(blogCOmments.concat(newComm));
    setComments("");
  };

  // console.log(
  //   "blog",
  //   blog.comments.map((c) => c)
  // );

  return (
    <div className="titleAuthor" key={blog.id}>
      <h2>
        {blog.title} {blog.author}
      </h2>

      <div className="blogUrl">{blog.url}</div>
      <div className="blogLikes">
        likes {blog.likes}{" "}
        <button onClick={addLike} id="like-button">
          like
        </button>
      </div>
      <div className="blogUser">Added by {blog.user.name}</div>

      <h3>comments</h3>
      <div>
        <input
          type="text"
          onChange={(e) => setComments(e.target.value)}
          value={comments}
        />
        <button type="button" onClick={addComment}>
          Add comment
        </button>
      </div>
      <ul>
        {blogCOmments.map((c) => (
          <li key={uuid()}>{c}</li>
        ))}
      </ul>
    </div>
  );
};

export default Blog;
