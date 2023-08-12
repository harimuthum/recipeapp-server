import express, { Router, application } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/user-model.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({
      username,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const foundUser = await UserModel.findOne({ username });
    if (!foundUser) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      foundUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        username: foundUser.username,
        id: foundUser._id,
      },
      "jwtKey",
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .json({ token, userID: foundUser._id, imageURL: foundUser.profileDP });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/update-dp", async (req, res) => {
  const { userID, profileDP } = req.body;

  await UserModel.findByIdAndUpdate(userID, { profileDP })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    })
    .then(() => {
      res.status(200).json({ message: "Profile picture updated successfully" });
    });
});

export const userRouter = router;

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "You are not authenticated" });
  }

  try {
    const decodedToken = jwt.verify(token, "jwtKey");
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(403).json({ message: "You are not authenticated" });
  }
};
