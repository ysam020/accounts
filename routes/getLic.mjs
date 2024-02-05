import express from "express";
import licModel from "../models/master/LicModel.mjs";

const router = express.Router();

router.get("/api/getLic", async (req, res) => {
  try {
    const data = await licModel.find({}).exec();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
