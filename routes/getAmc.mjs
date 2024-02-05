import express from "express";
import amcModel from "../models/amcModel.mjs";

const router = express.Router();

router.get("/api/getAmc", async (req, res) => {
  try {
    const data = await amcModel.find({}).exec();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
