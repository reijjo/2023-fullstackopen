import { isNotNumber } from "./utils";

interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const parseArgs = (args: string[]): { target: number; hours: number[] } => {
  if (args.length < 3) throw new Error("Not enough arguments");

  const target = Number(args[2]);
  if (isNaN(target)) {
    throw new Error("Provided target value is not a number!");
  }

  const hours = args.slice(3).map(Number);
  if (hours.some(isNotNumber)) {
    throw new Error("Provided values were not numbers!");
  }

  return { target, hours };
};

const calculateExercises = (target: number, hours: number[]): Result => {
  const periodLength = hours.length;
  const trainingDays = hours.filter((hour) => hour > 0).length;
  const totalHours = hours.reduce((acc, curr) => acc + curr, 0);
  const average = totalHours / periodLength;
  const success = average >= target;

  let rating: number;
  let ratingDescription: string;
  if (average < 1) {
    rating = 1;
    ratingDescription = "poor";
  } else if (average >= 1 && average <= 2) {
    rating = 2;
    ratingDescription = "not too bad but could be better";
  } else {
    rating = 3;
    ratingDescription = "excellent";
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

const args = process.argv;
try {
  const { target, hours } = parseArgs(args);
  const result = calculateExercises(target, hours);
  console.log(result);
} catch (error: unknown) {
  let errorMessage = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
}
