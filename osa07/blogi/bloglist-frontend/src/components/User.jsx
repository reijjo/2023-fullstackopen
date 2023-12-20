import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import userService from "../services/users";
import blogService from "../services/blogs";

const User = () => {
  const [user, setUser] = useState("");
  const [blogs, setBlogs] = useState([]);
  const { id } = useParams();

  console.log("id", id);
  useEffect(() => {
    const getUser = async () => {
      const user = await userService.getOne(id);
      setUser(user);
    };

    getUser();
  }, []);

  useEffect(() => {
    const getBlogs = async (user) => {
      const blogs = await blogService.getAll();
      const userBlogs = blogs.filter((b) => b.user.username === user.username);
      setBlogs(userBlogs);
    };

    getBlogs(user);
  }, [user]);

  // console.log("user", user);
  console.log(
    "blogs",
    blogs.map((blog) => blog.title)
  );

  return (
    <>
      <h2>{user.name}</h2>
      <div>
        <strong>added blogs</strong>
      </div>
      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </>
  );
};

export default User;
