import {Component} from 'angular2/core';
import {Recipe,Ingredient} from './recipe'
import {FactorioPartsComponent} from './factorio-parts'

@Component({
    selector: 'factorio-guide',
    directives: [FactorioPartsComponent],
    templateUrl: 'tpl/main.html'
})
export class AppComponent {
  recipes: Recipe[] = [];
}
