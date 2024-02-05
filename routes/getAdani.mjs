import express from "express";
import adaniModel from "../models/adaniModel.mjs";

const router = express.Router();

router.get("/api/getAdani", async (req, res) => {
  try {
    const data = await adaniModel.find({}).exec();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
