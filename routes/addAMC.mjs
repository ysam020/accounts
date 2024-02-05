import express from "express";
import amcModel from "../models/amcModel.mjs";

const router = express.Router();

router.post("/api/addAmc", (req, res) => {
  const data = new amcModel(req.body);
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
