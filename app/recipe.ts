
export function recipeFactory(data: any): Recipe {
  return {
    name: data.name,
    category: data.category || 'crafting',
    time: data.energy_required || 0.5,
    ingredients: parseIngredientsFromJson(data),
    results: parseResultsFromJson(data)
  };
};

export function parseIngredientsFromJson(data: any): Ingredient[] {
  let ingredients = [];

  for (let ingredient of data.ingredients) {
    if (! ingredient.hasOwnProperty('name')) {
      ingredients.push({
        name: ingredient[0],
        type: 'item', // TODO: Can be anything, should probably be determined from category which is often not there..
        amount: ingredient[1],
      });
    } else {
      ingredients.push(ingredient);
    }
  }

  return ingredients;
};

export function parseResultsFromJson(data: any): RecipeResult[] {
  let results = [];

  if (data.results !== undefined) {
    results = data.results;
  }

  if (data.result !== undefined) {
    results.push({
      type: 'item',
      name: data.result,
      amount: data.result_count || 1
    });
  }

  return results;
}

export interface Recipe {
  name: string;
  category: Category;
  time: number,
  ingredients: Ingredient[],
  results: RecipeResult[]
}

export type Category = "item" | "chemistry";
export type Type = "item" | "fluid";
export type RecipeType = "crafting" | "chemistry";
export type OilProcessingType = "basic" | "advanced";

export interface RecipeResult {
  type: Type;
  name: string;
  amount: number;
}

export interface Ingredient {
  type: Type;
  name: string;
  amount: number;
}

/*
export class Recipe {

  constructor(
      private _name,
      private _ingredients: Ingredient[],
      private type: RecipeType = RecipeType.Crafting,
      private _time: number,
      private _results: RecipeResult[]
    ) {
  }

  static fromResponse(data: any) {
    return new Recipe(
        data.name,
        data.ingredients.map(Recipe.mapIngredient),
        RecipeType.Crafting,
        data.energy_required || 0.5,
        Recipe.getResultsFromResponse(data)
      );
  }

  static mapIngredient(ingredient: any) {

    if (ingredient instanceof Array) {
      return new Ingredient(ingredient[0], ingredient[1]);
    }

    if (ingredient.type && ingredient.type == 'fluid') {
      return Ingredient.fluid(ingredient.name, ingredient.amount);
    }

    return new Ingredient(ingredient.name, ingredient.amount);
  }

  get name() {
    return this._name;
  }

  get ingredients() {
    return this._ingredients;
  }

  get time() {
    return this._time || 0.5;
  }

  get results() {
    return this._results;
  }

  private static getResultsFromResponse(data: any): any[] {
    let results = [];

    if (data.results !== undefined) {
      results = data.results;
    }

    if (data.result !== undefined) {
      results.push({
        name: data.result,
        type: 'item',
        amount: data.result_count || 1
      });
    }

    return results;
  }
}

export interface RecipeResult {
  name: string;
  type: string;
  amount: number;
}

export interface Part {
  name: string;
  type: string;
}

export class Ingredient {

  private type: IngredientType;

  constructor(public name: string, public amount: number) {
    this.type = IngredientType.Normal;
  }

  static fluid(name: string, amount: number): Ingredient {
    let ingredient = new Ingredient(name, amount);
    ingredient.type = IngredientType.Fluid;

    return ingredient;
  }
}

enum RecipeType {
  Crafting,
  Chemistry
}

enum IngredientType {
  Normal,
  Fluid
}
*/
