export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export type Diagnosis = {
  code: string;
  name: string;
  latin?: string;
};

export type Patient = {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: string;
  occupation: string;
};

export type CencoredPatient = Omit<Patient, "ssn">;

export type NewPatient = Omit<Patient, "id">;
