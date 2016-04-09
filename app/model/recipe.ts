
export interface Recipe {
  name: string;
  category: Category;
  time: number,
  ingredients: Ingredient[],
  results: RecipeResult[]
}

export enum Category {
  Item,
  Chemistry
}

export enum Type {
  Item,
  Fluid
}

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
