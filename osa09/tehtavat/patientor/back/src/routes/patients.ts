import express from "express";
import patientService from "../services/patientService";
import toNewPatient from "../utils";

const router = express.Router();

router.get("/", (_req, res) => {
  res.send(patientService.getPatientsCencored());
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  try {
    const patient = patientService.getOnePatient(id);

    if (!patient) {
      return res.status(404).json({ message: "patient not found" });
    }

    return res.json(patient);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    return res.status(400).send(errorMessage);
  }
});

router.get("/uncencored", (_req, res) => {
  res.send(patientService.getPatients());
});

router.post("/", (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    const addedPatient = patientService.addPatient(newPatient);

    res.json(addedPatient);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;
