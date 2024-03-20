import React from "react";
import { render } from "@testing-library/react";
import Todo from "./Todo";
test("renders todo text", () => {
  const todo = { text: "Test Todo", done: false };
  const { getByText } = render(<Todo todo={todo} />);
  // eslint-disable-next-line testing-library/prefer-screen-queries
  const todoTextElement = getByText(/Test Todo/i);
  expect(todoTextElement).toBeInTheDocument();
});
