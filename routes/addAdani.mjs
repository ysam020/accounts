import express from "express";
import adaniModel from "../models/master/adaniModel.mjs";

const router = express.Router();

router.post("/api/addAdani", (req, res) => {
  const data = new adaniModel(req.body);
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
