import express from "express";
import fdModel from "../models/fdModel.mjs";

const router = express.Router();

router.post("/api/addFd", (req, res) => {
  const data = new fdModel(req.body);
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
