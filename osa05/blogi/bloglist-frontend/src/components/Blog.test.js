import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import BlogForm from "./BlogForm";

test("5.13, renders title", () => {
  const blog = {
    title: "Moi oon title!",
  };

  render(<Blog blog={blog} />);

  const element = screen.getByText("Moi oon title!");
  expect(element).toBeDefined();
});

test("5.14, url likes user etc", async () => {
  const blog = {
    title: "Ollakko vai eiko olla",
    author: "Joku Viisas",
    url: "www.kiss.fi",
    likes: "102",
    user: {
      name: "Seppo",
    },
  };

  let container;

  container = render(<Blog blog={blog} />).container;

  const user = userEvent.setup();
  const button = screen.getByText("view");

  const titleAuthor = container.querySelector(".titleAuthor");
  expect(titleAuthor).toHaveTextContent("Ollakko vai eiko olla Joku Viisas");

  const nothing = screen.queryByText("www.kiss.fi");
  expect(nothing).not.toBeInTheDocument();

  await user.click(button);

  const afterClicked = screen.getByText("www.kiss.fi");
  expect(afterClicked).toBeInTheDocument();

  const likes = container.querySelector(".blogLikes");
  expect(likes).toHaveTextContent("102");

  const userWho = container.querySelector(".blogUser");
  expect(userWho).toHaveTextContent("Seppo");
});

test("5.15, click click", async () => {
  const blog = {
    title: "Ollakko vai eiko olla",
    author: "Joku Viisas",
    url: "www.kiss.fi",
    likes: "102",
    user: {
      name: "Seppo",
    },
  };

  const mockHandler = jest.fn();

  let container;

  container = render(<Blog blog={blog} likeBlog={mockHandler} />).container;

  const user = userEvent.setup();
  const button = screen.getByText("view");
  await user.click(button);

  const likeButton = screen.getByText("like");
  await user.click(likeButton);
  await user.click(likeButton);

  expect(mockHandler.mock.calls).toHaveLength(2);
});

test("5.16, BlogForm test", async () => {
  const user = userEvent.setup();
  const createBlog = jest.fn();

  render(<BlogForm createBlog={createBlog} />);

  const titleIn = screen.getByPlaceholderText("blog title");
  const authorIn = screen.getByPlaceholderText("blog author");
  const urlIn = screen.getByPlaceholderText("blog url");
  const createButton = screen.getByText("create");

  await user.type(titleIn, "Olen title");
  await user.type(authorIn, "Seppo");
  await user.type(urlIn, "www.url.com");

  await user.click(createButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe("Olen title");
  expect(createBlog.mock.calls[0][0].author).toBe("Seppo");
  expect(createBlog.mock.calls[0][0].url).toBe("www.url.com");
});
