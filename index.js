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
app.use((req, res, next) => {
res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  // Add other CORS headers if needed
  next();
});

getPgVersion();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.route("/recipe_detail").get(getRecipeDetail),
  app.route("/recipe_detail/:id").get(getRecipe_id),
  app.listen(PORT, () =>
    console.log(`Server running in port http://localhost:${PORT}`)
  );
