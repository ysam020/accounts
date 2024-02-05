import express from "express";
import mobileModel from "../models/master/mobileModel.mjs";

const router = express.Router();

router.post("/api/addMobile", (req, res) => {
  const data = new mobileModel(req.body);
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
