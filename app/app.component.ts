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
  { path: '/', redirectTo: ['FactorioParts', { part: 'low-density-structure', amount: 100, type: 'item' }] },
  { path: '/:type/:part/:amount', name: 'FactorioParts', component: FactorioPartsComponent, useAsDefault: true }
])

export class AppComponent {
}
