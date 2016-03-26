import {Component,OnInit,Injectable} from 'angular2/core';
import {Http, HTTP_PROVIDERS} from 'angular2/http';
import {Recipe, Ingredient} from './recipe';

@Component({
  selector: 'factorio-parts',
  templateUrl: 'tpl/factorio-parts.html',
  providers: [HTTP_PROVIDERS]
})


@Injectable()
export class FactorioPartsComponent implements OnInit {

  public parts: Recipe[] = [];
  public currentPart: Recipe;

  constructor(private http: Http) {

  }

  selectPart(event) {
    this.currentPart = this.findPart(event.target.value);
  }

  private findPart(part) {
    for (var key in this.parts) {
      if (this.parts[key].name == part) {
        return this.parts[key];
      }
    }
  }

  getRecipes() {
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
      });
  }

  ngOnInit() {
    this.getRecipes();
  }
}
