import express from "express";
import mobileModel from "../models/master/mobileModel.mjs";

const router = express.Router();

router.get("/api/getMobile", async (req, res) => {
  try {
    const data = await mobileModel.find({}).exec();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
