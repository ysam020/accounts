import express from "express";
import ccModel from "../models/master/creditCardModel.mjs";

const router = express.Router();

router.post("/api/addCc", (req, res) => {
  const data = new ccModel(req.body);
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
