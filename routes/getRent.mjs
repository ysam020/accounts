import express from "express";
import rentModel from "../models/master/rentModel.mjs";

const router = express.Router();

router.get("/api/getRent", async (req, res) => {
  try {
    const data = await rentModel.find({}).exec();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
