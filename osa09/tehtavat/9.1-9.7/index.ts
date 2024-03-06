import { calculateExercises } from "./calculateExercises";
import { bmicalc } from "./utils";

import express from "express";
const app = express();

app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const { height, weight } = req.query;
  if (!height || !weight) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  try {
    const bmi = bmicalc(String(height), String(weight));

    console.log("BMI", bmi);

    if (bmi <= 18.5) {
      return res
        .status(200)
        .json({ weight: weight, height: height, bmi: "Underweight" });
    } else if (bmi > 18.5 && bmi < 25) {
      return res
        .status(200)
        .json({ weight: weight, height: height, bmi: "Normal" });
    } else if (bmi >= 25 && bmi < 30) {
      return res
        .status(200)
        .json({ weight: weight, height: height, bmi: "Overweight" });
    } else {
      return res
        .status(200)
        .json({ weight: weight, height: height, bmi: "Obese" });
    }
  } catch (error: unknown) {
    let errorMessage = "Something bad happened.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }

    return res.status(500).json({ error: errorMessage });
  }
});

app.post("/exercises", (req, res) => {
  const { target, daily_exercises } = req.body;

  if (!target || !daily_exercises) {
    return res.status(400).json({ error: "parameters missing" });
  }

  const result = calculateExercises(target, daily_exercises);

  return res.status(200).send({ result });
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
