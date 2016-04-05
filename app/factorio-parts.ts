import {Component,OnInit, OnChanges, Injectable, Input} from 'angular2/core';
import {NgClass} from 'angular2/common';
import {Http, HTTP_PROVIDERS} from 'angular2/http';
import {Router, RouteParams, RouterLink, ROUTER_DIRECTIVES} from 'angular2/router';
import {Recipe, Ingredient, Type, RecipeType, RecipeResult, OilProcessingType} from './recipe';
import {recipeFactory} from './recipe';

interface OilOutput {
  'petroleum-gas': number;
  'light-oil': number;
  'heavy-oil': number;
}

let BasicOilOutput = {
  'petroleum-gas': 4 * 12,
  'light-oil': 3 * 12,
  'heavy-oil': 3 * 12
}

let AdvancedOilOutput = {
  'petroleum-gas': 5.5 * 12,
  'light-oil': 4.5 * 12,
  'heavy-oil': 1 * 12
}

@Component({
  selector: 'factorio-parts',
  templateUrl: 'tpl/factorio-parts.html',
  directives: [NgClass, RouterLink],
  providers: [HTTP_PROVIDERS]
})

@Injectable()
export class FactorioPartsComponent implements OnInit {

  recipes: Recipe[] = [];
  results: RecipeResult[] = [];

  selectedPart: string;
  amount: number = 1;

  assemblerCount = 1;
  assemblingSpeed = 0.75;

  refineries = 1;
  chemistryPlants = 1;
  oilProcessingType: OilProcessingType = 'basic';
  oilOutput: OilOutput = BasicOilOutput;

  currentResult: RecipeResult;
  currentRecipe: Recipe;
  possibleRecipes: Recipe[] = [];
  @Input() currentResultName: string;
  @Input() currentRecipeName: string;
  recipeType: RecipeType;

  constructor(private http: Http, private _router: Router, private _routeParams: RouteParams) {
  }

  recalculate() {
    this.possibleRecipes = this.getRecipesForResult(this.currentResult.name, this.recipeType);

    if (this.possibleRecipes.length > 0) {
      if (this.recipeType == 'chemistry') {
        this.recalculateChemistry();
      } else {
        this.currentRecipe = this.possibleRecipes[0];
        this.assemblerCount = Math.ceil(this.amount / (60 / (this.currentRecipe.time / this.assemblingSpeed)))
      }
    }
  }

  private recalculateChemistry() {
    this.oilOutput = this.oilProcessingType == 'basic' ? BasicOilOutput : AdvancedOilOutput;

    this.refineries = 1;
   
    var output = 0;
    var input: OilOutput = {
      'petroleum-gas': 0,
      'light-oil': 0,
      'heavy-oil': 0
    };

    do {

      for (let recipe of this.possibleRecipes) {
        var max = 0;
        for (let ingredient of recipe.ingredients) {
          input[ingredient.name] = ingredient.amount * 20;
        }

        output = output + (recipe.results.filter(r => r.name == this.currentResultName).map(r => r.amount).reduce((p,c) => p+c) * 20);
      }

      console.log(this.possibleRecipes, input, output);

    } while (false);
  }

  changeResult(resultName: string): void {
    this.currentResult = this.getResult(resultName);

    this.recalculate();
  }

  selectRecipe(recipe: Recipe): void {
    this.currentRecipe = recipe;
    this.currentRecipeName = recipe.name;
  }

  ingredientHasRecipeOfType(ingredient: Ingredient, type: RecipeType): boolean {
    return this.getRecipesForResult(ingredient.name).filter((r) => r.category == type).length > 0;
  }

  private initFromRoute(): void {
    this.amount = parseInt(this._routeParams.params['amount'] || '1', 10);
    this.recipeType = <RecipeType> this._routeParams.params['type'] || 'crafting';
    this.currentResultName = this._routeParams.params['result'] || 'electronic-circuit';
    this.currentResult = this.getResult(this.currentResultName);

    this.recalculate();
  }

  private getResult(resultName: string): RecipeResult {
    let result = this.results.filter((result => {
      return result.name == resultName;
    }));

    if (result.length == 0) {
      console.error(resultName);
      throw new Error("Could not find recipe for '" + resultName  +"'");
    }

    return result[0];
  }

  private getRecipesForResult(resultName: string, category?: RecipeType) {
    return this.recipes.filter((recipe: Recipe) => {
      if (category && recipe.category !== category) {
        return false;
      }

      for (let result of recipe.results) {
        if (result.name == resultName) {
          return true;
        }
      }

      return false;
    });
  }

  hasRecipe(ingredient: Ingredient) {
    return this.findPart(ingredient.name) !== undefined;
  }

  getRecipes(part: string): Recipe[] {
    return this.findPart(part);
  }

  ceil(val: number): number {
    return Math.ceil(val);
  }

  round(val: number) {
    return val.toFixed(2);
  }

  private populateParts() {
    this.results = [];
    for (let recipe of this.recipes) {
      for (let result of recipe.results) {
        if (! this.hasPart(result.name)) {
          this.results.push(result);
        }
      }
    }
  }

  private hasPart(name: string): boolean {
    for (let result of this.results) {
      if (result.name == name) {
        return true;
      }
    }

    return false;
  }

  private findPart(part): Recipe[] {
    let options = [];
    for (let recipe of this.recipes) {
      if (recipe.name == part) {
        options.push(recipe);
      }

      for (let res of recipe.results) {
        if (res.name == part) {
          options.push(recipe);
        }
      }
    }
    return options;
  }

  private loadRecipes() {
    this.http.get('resources/recipes.json')
      .subscribe(res => {
        let recipes = res.json();
        for (var key in recipes) {
          let recipe = recipes[key];

          this.recipes.push(recipeFactory(recipe))
        };

        this.recipes.sort((a, b) => {
          return a.name < b.name ? -1 : 1;
        });

        this.populateParts();
        this.initFromRoute();
      });
  }

  ngOnInit() {
    this.loadRecipes();
  }
}
