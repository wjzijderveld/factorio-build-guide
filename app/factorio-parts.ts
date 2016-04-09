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

  forRefineries(x: number): OilOutput;
}

class BasicOilOutput {
  public 'petroleum-gas' = 4 * 12 * this.refineries;
  public 'light-oil' = 3 * 12 * this.refineries;
  public 'heavy-oil' = 3 * 12 * this.refineries;

  constructor(private refineries: number = 1) {}

  forRefineries(x: number): BasicOilOutput {
    return new BasicOilOutput(x);
  }
}

class AdvancedOilOutput {
  public 'petroleum-gas' = 5.5 * 12 * this.refineries;
  public 'light-oil' = 4.5 * 12 * this.refineries;
  public 'heavy-oil' = 1 * 12 * this.refineries;
  
  constructor(private refineries: number = 1) {}
  
  forRefineries(x: number): AdvancedOilOutput {
    return new AdvancedOilOutput(x);
  }
}

interface ChemistryPlan {
  output: number,
  leftOvers: any,
  layout: ChemistryLayout
}

class ChemistryLayout {
  constructor(public refineries: number, public chemplants: Chemplant[]) {
    console.log(this.getTypes());
  }

  getTypes(): string[] {
    return this.chemplants.reduce((unique, chemplant) => {
      if (unique.indexOf(chemplant.recipe.name) == -1) {
        unique.push(chemplant.recipe.name);
      }

      return unique;
    }, []);
  }

  getGrouped(): any {
    return this.chemplants.reduce((grouped, chemplant) => {
      if (undefined == grouped[chemplant.recipe.name]) {
        grouped[chemplant.recipe.name] = [];
      }

      grouped[chemplant.recipe.name].push(chemplant);

      return grouped;
    }, {});
  }
}

interface Chemplant {
  recipe: Recipe
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
  chemistryPlan: ChemistryPlan;
  oilProcessingType: OilProcessingType = 'basic';
  oilOutput: OilOutput = new BasicOilOutput();
  oilInput: number;
  waterInput: number;

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
    this.oilOutput = this.oilProcessingType == 'basic' ? new BasicOilOutput() : new AdvancedOilOutput();
    this.oilInput = 10 * 20;
    this.waterInput = this.oilProcessingType == 'basic' ? 0 : 5 * 20;

    this.refineries = 1;
   
    var output = 0;
    var input = {
      'petroleum-gas': 0,
      'light-oil': 0,
      'heavy-oil': 0
    };

    let needMore = true;
    let plan: ChemistryPlan;
    let iteration = 0;
    while (needMore) {
      iteration++;
      plan = this.getChemistryBuildPlan(this.possibleRecipes, this.refineries);

      if (plan.output >= this.amount) {
        needMore = false;
        break;
      }

      if (iteration >= 10) {
        console.error('Infinit recursion is not nice');
        break;
      }

      this.refineries++;
      this.oilInput = (10 * 20) * this.refineries;
      if (this.oilProcessingType == 'advanced') {
        this.waterInput = (5 * 20) * this.refineries;
      }
    }

    this.chemistryPlan = plan;
  }

  private getChemistryBuildPlan(recipes: Recipe[], refineries: number): ChemistryPlan {

    let output = 0;
    let oilOutput = this.oilOutput.forRefineries(refineries);
    let chemplants: Chemplant[] = [];
    let rawProducts = ['heavy-oil', 'light-oil', 'petroleum-gas'];
    let rawProduct = (name: string) => { return rawProducts.indexOf(name) >= 0; }
    let leftOvers: any = {};

    if (rawProduct(this.currentResultName)) {
      output += oilOutput[this.currentResultName];
      oilOutput[this.currentResultName] = 0;
    }

    for (let product of rawProducts) {
      if (! oilOutput[product]) {
        break;
      }
      
      let recipe;
      if (product == 'heavy-oil') {
        recipe = this.recipes.filter((r => { return r.name === 'heavy-oil-cracking'; }))[0];
      } else {
        let found = false
        for (let r of recipes) {
          for (let i of r.ingredients) {
            if (i.name == product) {
              recipe = r;
              found = true;
              break;
            }
          }

          if (found) {
            break;
          }
        }

        if (!found) {
          console.error('Could not find ' + product + ' in recipes');
          leftOvers[product] = oilOutput[product];
          oilOutput[product] = 0;
        }
      }

      while (oilOutput[product] > 0) {

        let perMinute = Math.floor(60 / recipe.time);

        chemplants.push({ recipe: recipe });

        for (let i of recipe.ingredients) {
          if (i.name == product) {
            oilOutput[product] -= i.amount * perMinute;
          }
        }

        recipe.results.filter((r) => rawProduct(r.name) ).forEach((r) => {
          oilOutput[r.name] += r.amount * perMinute;
        });

        recipe.results.filter((r) => r.name == this.currentResultName ).forEach((r) => {
          output += r.amount * perMinute;
        });
      }
    }

    return {
      output: output,
      leftOvers: leftOvers,
      layout: new ChemistryLayout(refineries, chemplants)
    }
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

    if (this.recipeType == 'chemistry') {
      this.oilProcessingType = <OilProcessingType> this._routeParams.params['oilProcessing'] || 'basic';
    }

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
      if (category && recipe.category && recipe.category.indexOf(category) == -1) {
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
