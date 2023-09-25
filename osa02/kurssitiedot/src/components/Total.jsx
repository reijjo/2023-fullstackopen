const Total = ({ course }) => {
  console.log("Total course", course);

  const total = course.parts.reduce((sum, part) => sum + part.exercises, 0);

  return <p style={{ fontWeight: "bold" }}>total of {total} exercises</p>;
};

export default Total;
