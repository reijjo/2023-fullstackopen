import Part from "./Part";

const Content = ({ course }) => {
  console.log("Content course", course.parts);

  return (
    <>
      {course.parts.map((kurssi) => (
        <Part key={kurssi.id} part={kurssi.name} exer={kurssi.exercises} />
      ))}
    </>
  );
};

export default Content;
