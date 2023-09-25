const Part = ({ part, exer }) => {
  console.log("Part props", part);

  return (
    <p>
      {part} {exer}
    </p>
  );
};

export default Part;
