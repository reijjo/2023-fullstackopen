import express from "express";
import patientService from "../services/patientService";

const router = express.Router();

router.get("/", (_req, res) => {
  res.send(patientService.getPatientsCencored());
});

router.get("/uncencored", (_req, res) => {
  res.send(patientService.getPatients());
});

export default router;
