import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    ingredients: [{ type: String, required: true }],
    directions: { type: String, required: true },
    imageURL: { type: String, required: true },
    cookingTime: { type: Number, required: true },
    userOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

export const RecipeModel = mongoose.model("recipes", RecipeSchema);
