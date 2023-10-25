import { useState } from "react";

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({
    title: "",
    author: "",
    url: "",
  });

  const addBlog = async (event) => {
    event.preventDefault();
    await createBlog(newBlog);
    setNewBlog({ title: "", author: "", url: "" });
  };

  const handleBlog = (event) => {
    const { name, value } = event.target;
    setNewBlog({
      ...newBlog,
      [name]: value,
    });
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            type="text"
            name="title"
            value={newBlog.title}
            onChange={handleBlog}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            name="author"
            value={newBlog.author}
            onChange={handleBlog}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            name="url"
            value={newBlog.url}
            onChange={handleBlog}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );
};

export default BlogForm;
