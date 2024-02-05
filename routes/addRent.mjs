import express from "express";
import rentModel from "../models/rentModel.mjs";

const router = express.Router();

router.post("/api/addRent", (req, res) => {
  const data = new rentModel(req.body);
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
