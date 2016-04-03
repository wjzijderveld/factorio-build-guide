import {Component,OnInit,Injectable, Input} from 'angular2/core';
import {NgClass} from 'angular2/common';
import {Http, HTTP_PROVIDERS} from 'angular2/http';
import {Router,RouteParams} from 'angular2/router';
import {Recipe, Part, Ingredient} from './recipe';

@Component({
  selector: 'factorio-parts',
  templateUrl: 'tpl/factorio-parts.html',
  directives: [NgClass],
  providers: [HTTP_PROVIDERS]
})

@Injectable()
export class FactorioPartsComponent implements OnInit {

  recipes: Recipe[] = [];
  parts: Part[] = [];
  selectedPart: string;
  amount: number = 1;
  assemblerCount = 1;
  assemblingSpeed = 0.75;
  @Input() currentPart: Recipe;
  partType: string;

  constructor(private http: Http, private _router: Router, private _routeParams: RouteParams) {
    this.partType = _routeParams['type'];
  }

  updateBuild() {
    let newPart = this.findPart(this.selectedPart);

    if (! newPart) {
      return;
    }
    

    this.currentPart = newPart[0];
    this.assemblerCount = Math.ceil(this.amount / (60 / (this.currentPart.time / this.assemblingSpeed)));
  }

  changeBuild(ingredient: Ingredient) {

    if (!this.findPart(ingredient.name)) {
      return;
    }
    
    this._router.navigate(['FactorioParts', {
      part: ingredient.name,
      amount: ingredient.amount * this.assemblerCount * this.ceil(60 / this.currentPart.time)
    }]);

    /*
    this.selectedPart = ingredient.name;
    this.amount = ingredient.amount * this.assemblerCount;
    this.updateBuild();
    */
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
    this.parts = [];
    for (let recipe of this.recipes) {
      for (let result of recipe.results) {
        console.log(result.type);
        if (! this.hasPart(result.name)) {
          this.parts.push(result);
        }
      }
    }
  }

  private hasPart(name: string): boolean {
    for (let part of this.parts) {
      if (part.name == name) {
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

          this.recipes.push(Recipe.fromResponse(recipe))
        };

        this.recipes.sort((a, b) => {
          return a.name < b.name ? -1 : 1;
        });

        this.populateParts();

        if (this._routeParams.params['part'] && this._routeParams.params['amount']) {
          this.selectedPart = this._routeParams.params['part'];
          this.amount = parseInt(this._routeParams.params['amount'], 10);
          this.updateBuild();
        } else {
          this.currentPart = this.recipes[0];
          this.selectedPart = this.currentPart.name;
        }
      });
  }

  ngOnInit() {
    this.loadRecipes();
  }

  ngOnChanges() {
    console.log('OnChanges');
    console.log(arguments);
  }
}
