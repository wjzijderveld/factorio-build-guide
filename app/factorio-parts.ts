import {Component,OnInit,Injectable, Input} from 'angular2/core';
import {NgClass} from 'angular2/common';
import {Http, HTTP_PROVIDERS} from 'angular2/http';
import {Recipe, Ingredient} from './recipe';

@Component({
  selector: 'factorio-parts',
  templateUrl: 'tpl/factorio-parts.html',
  directives: [NgClass],
  providers: [HTTP_PROVIDERS]
})


@Injectable()
export class FactorioPartsComponent implements OnInit {

  parts: Recipe[] = [];
  selectedPart: string;
  amount: number = 1;
  assemblerCount = 1;
  @Input() currentPart: Recipe;

  constructor(private http: Http) {

  }

  updateBuild() {
    let newPart = this.findPart(this.selectedPart);

    if (! newPart) {
      return;
    }

    this.currentPart = newPart;
    this.assemblerCount = Math.ceil(this.amount / (60 / this.currentPart.time));
  }

  changeBuild(ingredient: Ingredient) {

    if (!this.findPart(ingredient.name)) {
      return;
    }

    this.selectedPart = ingredient.name;
    this.amount = ingredient.amount * this.assemblerCount;
    this.updateBuild();
  }

  hasRecipe(ingredient: Ingredient) {
    return this.findPart(ingredient.name) !== undefined;
  }

  ceil(val: number) {
    return Math.ceil(val);
  }

  round(val: number) {
    return val.toFixed(2);
  }

  private findPart(part) {
    for (var key in this.parts) {
      if (this.parts[key].name == part) {
        return this.parts[key];
      }
    }
  }

  private getRecipes() {
    this.http.get('resources/recipes.json')
      .subscribe(res => {
        let recipes = res.json();
        for (var key in recipes) {
          let recipe = recipes[key];

          this.parts.push(Recipe.fromResponse(recipe))
        };

        this.parts.sort((a, b) => {
          return a.name < b.name ? -1 : 1;
        });

        this.currentPart = this.parts[0];
        this.selectedPart = this.currentPart.name;
      });
  }

  ngOnInit() {
    this.getRecipes();
  }

  ngOnChanges() {
    console.log('OnChanges');
    console.log(arguments);
  }
}