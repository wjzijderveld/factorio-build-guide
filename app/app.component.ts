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
  { path: '/', redirectTo: ['ItemResult', { result: 'electronic-circuit', amount: 100, type: 'crafting' }] },
  { path: '/:type/:result/:amount', component: FactorioPartsComponent, as: 'ItemResult' },
  { path: '/:type/:result/:amount/:oilProcessing', component: FactorioPartsComponent, as: 'FluidResult' }
])

export class AppComponent {
}
