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
            id="title"
            value={newBlog.title}
            onChange={handleBlog}
            placeholder="blog title"
          />
        </div>
        <div>
          author:
          <input
            type="text"
            name="author"
            id="author"
            value={newBlog.author}
            onChange={handleBlog}
            placeholder="blog author"
          />
        </div>
        <div>
          url:
          <input
            type="text"
            name="url"
            id="url"
            value={newBlog.url}
            onChange={handleBlog}
            placeholder="blog url"
          />
        </div>
        <button type="submit" id="create-button">
          create
        </button>
      </form>
    </>
  );
};

export default BlogForm;
