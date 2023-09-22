import { useState } from "react";

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
      <button onClick={handleGood}>good</button>
      <button onClick={handleNeutral}>neutral</button>
      <button onClick={handleBad}>bad</button>
      <h2>statistics</h2>
      <div>good {good}</div>
      <div>neutral {neutral}</div>
      <div>bad {bad}</div>
      <div>all {all}</div>
      <div>average {score / all}</div>
      <div>positive {(pos / all) * 100} %</div>
    </div>
  );
};

export default App;
