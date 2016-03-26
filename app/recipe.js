System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Recipe, Ingredient, RecipeType, IngredientType;
    return {
        setters:[],
        execute: function() {
            Recipe = (function () {
                function Recipe(_name, ingredients, type) {
                    if (type === void 0) { type = RecipeType.Crafting; }
                    this._name = _name;
                    this.ingredients = ingredients;
                    this.type = type;
                }
                Recipe.fromResponse = function (data) {
                    return new Recipe(data.name, data.ingredients.map(Recipe.mapIngredient), RecipeType.Crafting);
                };
                Recipe.mapIngredient = function (ingredient) {
                    if (ingredient instanceof Array) {
                        return new Ingredient(ingredient[0], ingredient[1]);
                    }
                    if (ingredient.type && ingredient.type == 'fluid') {
                        return Ingredient.fluid(ingredient.name, ingredient.amount);
                    }
                    return new Ingredient(ingredient.name, ingredient.amount);
                };
                Object.defineProperty(Recipe.prototype, "name", {
                    get: function () {
                        return this._name;
                    },
                    enumerable: true,
                    configurable: true
                });
                return Recipe;
            }());
            exports_1("Recipe", Recipe);
            Ingredient = (function () {
                function Ingredient(name, amount) {
                    this.name = name;
                    this.amount = amount;
                    this.type = IngredientType.Normal;
                }
                Ingredient.fluid = function (name, amount) {
                    var ingredient = new Ingredient(name, amount);
                    ingredient.type = IngredientType.Fluid;
                    return ingredient;
                };
                return Ingredient;
            }());
            exports_1("Ingredient", Ingredient);
            (function (RecipeType) {
                RecipeType[RecipeType["Crafting"] = 0] = "Crafting";
                RecipeType[RecipeType["Chemistry"] = 1] = "Chemistry";
            })(RecipeType || (RecipeType = {}));
            (function (IngredientType) {
                IngredientType[IngredientType["Normal"] = 0] = "Normal";
                IngredientType[IngredientType["Fluid"] = 1] = "Fluid";
            })(IngredientType || (IngredientType = {}));
        }
    }
});
//# sourceMappingURL=recipe.js.map