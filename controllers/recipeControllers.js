const { pool } = require("../DB/dbConnect");

const getRecipeDetail = (req, res) => {
  const query = `
      SELECT
        r.recipe_id,
        r.recipe_name,
        r.description,
        r.cooking_time,
        r.image_link,
        r.calories,
        r.portions,
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

    const recipes = {};
    results.rows.forEach((row) => {
      if (!recipes[row.recipe_id]) {
        recipes[row.recipe_id] = {
          recipe_id: row.recipe_id,
          recipe_name: row.recipe_name,
          description: row.description,
          cooking_time: row.cooking_time,
          calories: row.calories,
          portions: row.portions,
          image_link: row.image_link,
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

const getRecipe_id = (req, res) => {
  const recipeId = req.params.id;
  const query = `
    SELECT
      r.recipe_id,
      r.recipe_name,
      r.description,
      r.cooking_time,
      r.image_link,
      r.calories,
      r.portions,
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
    WHERE
      r.recipe_id = $1
    ORDER BY
      s.step_number;
  `;

  pool.query(query, [recipeId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (results.rows.length === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    const recipe = {
      recipe_id: results.rows[0].recipe_id,
      recipe_name: results.rows[0].recipe_name,
      description: results.rows[0].description,
      cooking_time: results.rows[0].cooking_time,
      calories: results.rows[0].calories,
      portions: results.rows[0].portions,
      image_link: results.rows[0].image_link,
      ingredients: [],
      steps: [],
    };

    results.rows.forEach((row) => {
      if (
        row.ingredient_name &&
        !recipe.ingredients.find(
          (ing) =>
            ing.ingredient_name === row.ingredient_name &&
            ing.measurement === row.measurement
        )
      ) {
        recipe.ingredients.push({
          ingredient_name: row.ingredient_name,
          measurement: row.measurement,
        });
      }

      if (
        row.step_number &&
        row.instruction &&
        !recipe.steps.find(
          (step) =>
            step.step_number === row.step_number &&
            step.instruction === row.instruction
        )
      ) {
        recipe.steps.push({
          step_number: row.step_number,
          instruction: row.instruction,
        });
      }
    });

    res.status(200).json(recipe);
  });
};


module.exports = {
  getRecipeDetail,
  getRecipe_id,
};
