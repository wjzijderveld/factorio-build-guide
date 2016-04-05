import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_PROVIDERS, ROUTER_DIRECTIVES} from 'angular2/router';
import {Recipe,Ingredient} from './recipe'
import {FactorioPartsComponent} from './factorio-parts'

@Component({
    selector: 'factorio-guide',
    directives: [FactorioPartsComponent, ROUTER_DIRECTIVES],
    templateUrl: 'tpl/main.html'
})

@RouteConfig([
//  { path: '/', redirectTo: ['FactorioParts', { result: 'rocket-fuel', amount: 100, type: 'item' }] },
  { path: '/:type/:result/:amount', name: 'FactorioParts', component: FactorioPartsComponent }
])

export class AppComponent {
}
