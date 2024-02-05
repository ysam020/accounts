import express from "express";
import ccModel from "../models/master/creditCardModel.mjs";

const router = express.Router();

router.get("/api/getCc", async (req, res) => {
  try {
    const data = await ccModel.find({}).exec();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
