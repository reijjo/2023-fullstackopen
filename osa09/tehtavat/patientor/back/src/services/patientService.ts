import patients from "../../data/patients";

import { Patient, CencoredPatient } from "../types";

const getPatients = (): Patient[] => {
  return patients;
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

export default {
  getPatients,
  getPatientsCencored,
};
