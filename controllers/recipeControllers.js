const { pool } = require("../DB/dbConnect");

/* const getAllRecipes = (req, res) => {
    pool.query("SELECT * FROM recipes", (error, results) => {
        if (error) {
            throw error;
        }
        res.joson(results.rows)
    })
}; */

/* const getRecipe = (req, res) => {}; */

const getRecipeDetail = (req, res) => {
  const query = `
      SELECT
        r.recipe_id,
        r.recipe_name,
        r.description,
        r.cooking_time,
        i.ingredient_name,
        ri.measurement,
        s.step_number,
        s.instruction
      FROM
        recipes r
      LEFT JOIN
        recipe_ingredients ri ON r.recipe_id = ri.recipe_id
      LEFT JOIN
        ingredients i ON ri.ingredient_id = i.ingredient_id
      LEFT JOIN
        steps s ON r.recipe_id = s.recipe_id
      ORDER BY
        r.recipe_id, s.step_number;
    `;

  pool.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Group the results by recipe
    const recipes = {};
    results.rows.forEach((row) => {
      if (!recipes[row.recipe_id]) {
        recipes[row.recipe_id] = {
          recipe_id: row.recipe_id,
          recipe_name: row.recipe_name,
          description: row.description,
          cooking_time: row.cooking_time,
          ingredients: [],
          steps: [],
        };
      }

      if (
        row.ingredient_name &&
        !recipes[row.recipe_id].ingredients.find(
          (ing) =>
            ing.ingredient_name === row.ingredient_name &&
            ing.measurement === row.measurement
        )
      ) {
        recipes[row.recipe_id].ingredients.push({
          ingredient_name: row.ingredient_name,
          measurement: row.measurement,
        });
      }

      if (
        row.step_number &&
        row.instruction &&
        !recipes[row.recipe_id].steps.find(
          (step) =>
            step.step_number === row.step_number &&
            step.instruction === row.instruction
        )
      ) {
        recipes[row.recipe_id].steps.push({
          step_number: row.step_number,
          instruction: row.instruction,
        });
      }
    });

    res.status(200).json(Object.values(recipes));
  });
};

const updateRecipe = (req, res) => {};

const deleteRecipe = (req, res) => {};

module.exports = {
  getRecipeDetail,
  updateRecipe,
  deleteRecipe,
};
