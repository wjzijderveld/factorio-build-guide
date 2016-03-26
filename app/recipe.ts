export class Recipe {

  constructor(private _name, private ingredients: Ingredient[], private type: RecipeType = RecipeType.Crafting) {
  }

  static fromResponse(data: any) {
    return new Recipe(data.name, data.ingredients.map(Recipe.mapIngredient), RecipeType.Crafting);
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
}

export class Ingredient {

  private type: IngredientType;

  constructor(private name: string, private amount: number) {
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
