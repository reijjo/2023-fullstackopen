type Props = {
  totalExercises: number;
};

const Total = ({ totalExercises }: Props) => {
  return (
    <>
      <p>Number of exercises {totalExercises}</p>
    </>
  );
};

export default Total;
