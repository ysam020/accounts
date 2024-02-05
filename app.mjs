import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import addAdani from "./routes/addAdani.mjs";
import addAmc from "./routes/addAMC.mjs";
import addCc from "./routes/addCC.mjs";
import addElectricity from "./routes/addElectricity.mjs";
import addFd from "./routes/addFD.mjs";
import addLic from "./routes/addLIC.mjs";
import addMobile from "./routes/addMobile.mjs";
import addRent from "./routes/addRent.mjs";

import getAdani from "./routes/getAdani.mjs";
import getAmc from "./routes/getAmc.mjs";
import getCc from "./routes/getCc.mjs";
import getElectricity from "./routes/getElectricity.mjs";
import getFd from "./routes/getFd.mjs";
import getLic from "./routes/getLic.mjs";
import getMobile from "./routes/getMobile.mjs";
import getRent from "./routes/getRent.mjs";

import adaniIntimation from "./routes/adaniIntimation.mjs";
import amcIntimation from "./routes/amcIntimation.mjs";
import ccIntimation from "./routes/creditCardIntimation.mjs";
import electricityIntimation from "./routes/electricityIntimation.mjs";
import fdIntimation from "./routes/fdIntimation.mjs";
import licIntimation from "./routes/licIntimation.mjs";
import mobileIntimation from "./routes/mobileIntimation.mjs";
import rentIntimation from "./routes/rentIntimation.mjs";

import login from "./routes/login.mjs";

const app = express();
app.use(bodyParser.json({ limit: "100mb" }));
app.use(cors());
app.use(express.json());

mongoose
  .connect(
    // "mongodb://localhost:27017/accounts",
    "mongodb+srv://exim:qTT7e4YeE3YSSMiV@aivision.pxmpvlz.mongodb.net/exim?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    app.listen(4000, () => {
      app.use(addAdani);
      app.use(addAmc);
      app.use(addCc);
      app.use(addElectricity);
      app.use(addFd);
      app.use(addLic);
      app.use(addMobile);
      app.use(addRent);

      app.use(getAdani);
      app.use(getAmc);
      app.use(getCc);
      app.use(getElectricity);
      app.use(getFd);
      app.use(getLic);
      app.use(getMobile);
      app.use(getRent);

      app.use(adaniIntimation);
      app.use(amcIntimation);
      app.use(ccIntimation);
      app.use(electricityIntimation);
      app.use(fdIntimation);
      app.use(licIntimation);
      app.use(mobileIntimation);
      app.use(rentIntimation);

      app.use(login);

      console.log("Server is running on port 4000");
    });
  });
