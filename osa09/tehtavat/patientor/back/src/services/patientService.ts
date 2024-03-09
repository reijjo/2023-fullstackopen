import patients from "../../data/patients";
import { v4 as uuidv4 } from "uuid";

import { Patient, CencoredPatient, NewPatient } from "../types";

const getPatients = (): Patient[] => {
  return patients;
};

const getOnePatient = (id: string) => {
  const patient = patients.find((p) => p.id === id);

  return patient;
};

const getPatientsCencored = (): CencoredPatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (entry: NewPatient): Patient => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const id = uuidv4();

  const newPatient = {
    id: id,
    ...entry,
  };

  patients.push(newPatient);
  return newPatient;
};

export default {
  getPatients,
  getPatientsCencored,
  addPatient,
  getOnePatient,
};
