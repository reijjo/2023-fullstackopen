import { useDispatch } from "react-redux";
import { setNotification } from "../reducers/notificationReducer";
import Togglable from "./Togglable";
import BlogForm from "./BlogForm";
import { useRef } from "react";
import { initBlogs } from "../reducers/blogReducer";
import blogService from "../services/blogs";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
} from "@mui/material";

const Blogs = ({ blogs, user }) => {
  const dispatch = useDispatch();
  const blogFormRef = useRef();

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const addBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject);
      console.log("addblog blogs.jsx", newBlog);

      dispatch(initBlogs());

      dispatch(
        setNotification(
          `a new blog ${newBlog.title} by ${newBlog.author} added`
        )
      );

      blogFormRef.current.toggleVisibility();
    } catch (exception) {
      dispatch(setNotification("Error creating blog", exception));
      console.error(exception);
    }
  };

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  if (!user || !blogs) {
    return null;
  }

  return (
    <>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {sortedBlogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>
                  <Link to={`/blogs/${blog.id}`}>
                    {blog.title} {blog.author}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* {sortedBlogs.map((blog) => (
        <Link key={blog.id} to={`/blogs/${blog.id}`}>
          <div style={blogStyle}>
            {blog.title} {blog.author}
          </div>
        </Link>
      ))} */}
    </>
  );
};

export default Blogs;
