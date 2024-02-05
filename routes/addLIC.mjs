import express from "express";
import licModel from "../models/master/LicModel.mjs";

const router = express.Router();

router.post("/api/addLic", (req, res) => {
  const data = new licModel(req.body);
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
