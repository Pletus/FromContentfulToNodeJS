const { pool } = require("../DB/dbConnect");

const getAllRecipes = (req, res) => {
    pool.query("SELECT * FROM recipes", (error, results) => {
        if (error) {
            throw error;
        }
        res.joson(results.rows)
    })
};

const getRecipe = (req, res) => {};

const createRecipe = (req, res) => {};
const updateRecipe = (req, res) => {};

const deleteRecipe = (req, res) => {}; 

module.exports = {
  getAllRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
