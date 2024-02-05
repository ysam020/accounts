import express from "express";
import electricityModel from "../models/master/ElectricityModel.mjs";

const router = express.Router();

router.post("/api/addElectricity", (req, res) => {
  const data = new electricityModel(req.body);
  data
    .save()
    .then((data) => {
      res.send({ message: "Data added successfully" });
    })
    .catch((error) => {
      res.send(error);
    });
});

export default router;
