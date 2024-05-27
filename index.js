const express = require("express");
const app = express();
require("dotenv").config();

const { getPgVersion, pool } = require("./DB/dbConnect");
const {
  getAllRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe
} = require("./controllers/recipeControllers");

const PORT = process.env.Database || 8000;

app.use(express.json());

getPgVersion();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.route("/recipes").get(getAllRecipes).post(createRecipe);
app.route("/recipes/:id").get(getRecipe).put(updateRecipe).delete(deleteRecipe);

app.listen(PORT, () =>
  console.log(`Server running in port http://localhost:${PORT}`)
);
