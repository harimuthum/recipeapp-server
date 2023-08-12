import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


import { userRouter } from "./routes/user-routes.js";
import { recipesRouter } from "./routes/recipe-router.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", userRouter);
app.use("/api/recipes", recipesRouter);

mongoose
  .connect(
    "mongodb+srv://harimuthu:hari123@cluster0.r5019kz.mongodb.net/recipes",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .catch((error) => console.log("Atlas not connected"))
  .then(() => console.log("Connected to Mongo Atlas"));

app.listen(5000, () => console.log("Server is running on port 5000"));