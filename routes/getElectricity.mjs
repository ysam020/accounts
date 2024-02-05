import express from "express";
import electricityModel from "../models/ElectricityModel.mjs";

const router = express.Router();

router.get("/api/getElectricity", async (req, res) => {
  try {
    const data = await electricityModel.find({}).exec();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
