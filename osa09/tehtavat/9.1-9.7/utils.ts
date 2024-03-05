export const isNotNumber = (argument: any): boolean => isNaN(Number(argument));

export const bmicalc = (height: string, weight: string) => {
  const parsedHeight = Number(height) / 100;
  const parsedWeight = Number(weight);

  return parsedWeight / (parsedHeight * parsedHeight);
};
