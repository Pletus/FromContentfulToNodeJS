const express = require("express");
const app = express();
require("dotenv").config();

const { getPgVersion, pool } = require("./DB/dbConnect");
const {
  getRecipeDetail,
  getRecipe_id,
} = require("./controllers/recipeControllers");

const PORT = process.env.Database || 8000;

app.use(express.json());

getPgVersion();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.route("/recipe_detail").get(getRecipeDetail),
  app.route("/recipe_detail/:id").get(getRecipe_id),
  app.listen(PORT, () =>
    console.log(`Server running in port http://localhost:${PORT}`)
  );
