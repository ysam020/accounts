import express from "express";
import fdModel from "../models/master/fdModel.mjs";

const router = express.Router();

router.get("/api/getFd", async (req, res) => {
  try {
    const data = await fdModel.find({}).exec();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
