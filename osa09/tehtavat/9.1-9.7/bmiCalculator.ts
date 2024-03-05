interface BmiValues {
  height: number;
  weight: number;
}

const parseArgs = (args: string[]): BmiValues => {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.length > 4) throw new Error("Too many arguments");

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3]),
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

const bmiCalculator = (a: number, b: number) => {
  const convert = a / 100;
  return b / (convert * convert);
};

try {
  const { height, weight } = parseArgs(process.argv);
  const bmi = bmiCalculator(height, weight);

  console.log("BMI", bmi);

  if (bmi <= 18.5) {
    console.log("Underweight");
  } else if (bmi > 18.5 && bmi < 25) {
    console.log("Normal");
  } else if (bmi >= 25 && bmi < 30) {
    console.log("Overweight");
  } else {
    console.log("Obese");
  }
} catch (error: unknown) {
  let errorMessage = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
}
