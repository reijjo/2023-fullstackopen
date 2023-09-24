import { useState } from "react";

const Statistics = (props) => (
  <tr>
    <td>
      {props.text} {props.value}
    </td>
  </tr>
);

const Button = ({ handleClick, text }) => {
  return <button onClick={handleClick}>{text}</button>;
};

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [all, setAll] = useState(0);
  const [score, setScore] = useState(0);
  const [pos, setPos] = useState(0);

  const handleGood = () => {
    const updatedGood = good + 1;
    setGood(updatedGood);
    setAll(all + 1);
    setScore(score + 1);
    setPos(pos + 1);
  };

  const handleNeutral = () => {
    const updatedN = neutral + 1;
    setNeutral(updatedN);
    setAll(all + 1);
  };

  const handleBad = () => {
    const updatedBad = bad + 1;
    setBad(updatedBad);
    setAll(all + 1);
    setScore(score - 1);
  };

  return (
    <div>
      <h2>give feedback</h2>
      <Button handleClick={handleGood} text="good" />
      <Button handleClick={handleNeutral} text="neutral" />
      <Button handleClick={handleBad} text="bad" />

      {all ? (
        <>
          <h2>statistics</h2>
          <table>
            <tbody>
              <Statistics text="good" value={good} />
              <Statistics text="neutral" value={neutral} />
              <Statistics text="bad" value={bad} />
              <Statistics text="all" value={all} />
              <Statistics text="score" value={score / all} />
              <Statistics text="pos" value={(pos / all) * 100 + " %"} />
            </tbody>
          </table>
        </>
      ) : (
        <>
          <p>No feedback given</p>
        </>
      )}
    </div>
  );
};

export default App;
