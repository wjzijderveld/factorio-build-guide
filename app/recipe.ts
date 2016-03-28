export class Recipe {

  constructor(private _name, private _ingredients: Ingredient[], private type: RecipeType = RecipeType.Crafting, private _time: number) {
  }

  static fromResponse(data: any) {
    return new Recipe(data.name, data.ingredients.map(Recipe.mapIngredient), RecipeType.Crafting, data.energy_required || 0.5);
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
