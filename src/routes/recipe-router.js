import express from "express";
import mongoose from "mongoose";
import { RecipeModel } from "../models/recipe-model.js";
import { UserModel } from "../models/user-model.js";
import { verifyToken } from "./user-routes.js";

const router = express.Router();

router.get("/", async (req, res) => {
  await RecipeModel.find({})
    .catch((err) => console.log(err))
    .then((recipes) => {
      // console.log(recipes);
      res.status(200).json(recipes);
    });
});

router.post("/", verifyToken, async (req, res) => {
  const newRecipe = new RecipeModel(req.body);
  await newRecipe
    .save()
    .catch((err) => console.log(err.message))
    .then((response) => {
      res.status(200).json(response);
    });
});

router.put("/", verifyToken, async (req, res) => {
  const recipe = await RecipeModel.findById(req.body.recipeID);
  // console.log(recipe);
  const user = await UserModel.findById(req.body.userID);
  // console.log(user);

  user.savedRecipes.push(recipe);
  await user
    .save()
    .catch((err) => console.log("Here"))
    .then(() => {
      res.status(200).json({ savedRecipes: user.savedRecipes });
    });
});

router.get("/saved-recipes/ids/:userID", async (req, res) => {
  await UserModel.findById(req.params.userID)
    .catch((err) => console.log(err))
    .then((user) => {
      res.status(200).json({ savedRecipes: user?.savedRecipes });
    });
});

router.get("/saved-recipes/:userID", async (req, res) => {
  const user = await UserModel.findById(req.params.userID);
  await RecipeModel.find({
    _id: { $in: user.savedRecipes },
  })
    .catch((err) => console.log(err))
    .then((savedRecipes) => {
      res.status(200).json({ savedRecipes });
    });
});

export const recipesRouter = router;
