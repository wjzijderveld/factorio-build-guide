System.register(['angular2/core', 'angular2/common', 'angular2/http', 'angular2/router', './recipe'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, common_1, http_1, router_1, recipe_1;
    var BasicOilOutput, AdvancedOilOutput, FactorioPartsComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (recipe_1_1) {
                recipe_1 = recipe_1_1;
            }],
        execute: function() {
            BasicOilOutput = {
                'petroleum-gas': 4 * 12,
                'light-oil': 3 * 12,
                'heavy-oil': 3 * 12
            };
            AdvancedOilOutput = {
                'petroleum-gas': 5.5 * 12,
                'light-oil': 4.5 * 12,
                'heavy-oil': 1 * 12
            };
            FactorioPartsComponent = (function () {
                function FactorioPartsComponent(http, _router, _routeParams) {
                    this.http = http;
                    this._router = _router;
                    this._routeParams = _routeParams;
                    this.recipes = [];
                    this.results = [];
                    this.amount = 1;
                    this.assemblerCount = 1;
                    this.assemblingSpeed = 0.75;
                    this.refineries = 1;
                    this.chemistryPlants = 1;
                    this.oilProcessingType = 'basic';
                    this.oilOutput = BasicOilOutput;
                    this.possibleRecipes = [];
                }
                FactorioPartsComponent.prototype.recalculate = function () {
                    this.possibleRecipes = this.getRecipesForResult(this.currentResult.name, this.recipeType);
                    if (this.possibleRecipes.length > 0) {
                        if (this.recipeType == 'chemistry') {
                            this.recalculateChemistry();
                        }
                        else {
                            this.currentRecipe = this.possibleRecipes[0];
                            this.assemblerCount = Math.ceil(this.amount / (60 / (this.currentRecipe.time / this.assemblingSpeed)));
                        }
                    }
                };
                FactorioPartsComponent.prototype.recalculateChemistry = function () {
                    var _this = this;
                    this.oilOutput = this.oilProcessingType == 'basic' ? BasicOilOutput : AdvancedOilOutput;
                    this.refineries = 1;
                    var output = 0;
                    var input = {
                        'petroleum-gas': 0,
                        'light-oil': 0,
                        'heavy-oil': 0
                    };
                    do {
                        for (var _i = 0, _a = this.possibleRecipes; _i < _a.length; _i++) {
                            var recipe = _a[_i];
                            var max = 0;
                            for (var _b = 0, _c = recipe.ingredients; _b < _c.length; _b++) {
                                var ingredient = _c[_b];
                                input[ingredient.name] = ingredient.amount * 20;
                            }
                            output = output + (recipe.results.filter(function (r) { return r.name == _this.currentResultName; }).map(function (r) { return r.amount; }).reduce(function (p, c) { return p + c; }) * 20);
                        }
                        console.log(this.possibleRecipes, input, output);
                    } while (false);
                };
                FactorioPartsComponent.prototype.changeResult = function (resultName) {
                    this.currentResult = this.getResult(resultName);
                    this.recalculate();
                };
                FactorioPartsComponent.prototype.selectRecipe = function (recipe) {
                    this.currentRecipe = recipe;
                    this.currentRecipeName = recipe.name;
                };
                FactorioPartsComponent.prototype.ingredientHasRecipeOfType = function (ingredient, type) {
                    return this.getRecipesForResult(ingredient.name).filter(function (r) { return r.category == type; }).length > 0;
                };
                FactorioPartsComponent.prototype.initFromRoute = function () {
                    this.amount = parseInt(this._routeParams.params['amount'] || '1', 10);
                    this.recipeType = this._routeParams.params['type'] || 'crafting';
                    this.currentResultName = this._routeParams.params['result'] || 'electronic-circuit';
                    this.currentResult = this.getResult(this.currentResultName);
                    this.recalculate();
                };
                FactorioPartsComponent.prototype.getResult = function (resultName) {
                    var result = this.results.filter((function (result) {
                        return result.name == resultName;
                    }));
                    if (result.length == 0) {
                        console.error(resultName);
                        throw new Error("Could not find recipe for '" + resultName + "'");
                    }
                    return result[0];
                };
                FactorioPartsComponent.prototype.getRecipesForResult = function (resultName, category) {
                    return this.recipes.filter(function (recipe) {
                        if (category && recipe.category !== category) {
                            return false;
                        }
                        for (var _i = 0, _a = recipe.results; _i < _a.length; _i++) {
                            var result = _a[_i];
                            if (result.name == resultName) {
                                return true;
                            }
                        }
                        return false;
                    });
                };
                FactorioPartsComponent.prototype.hasRecipe = function (ingredient) {
                    return this.findPart(ingredient.name) !== undefined;
                };
                FactorioPartsComponent.prototype.getRecipes = function (part) {
                    return this.findPart(part);
                };
                FactorioPartsComponent.prototype.ceil = function (val) {
                    return Math.ceil(val);
                };
                FactorioPartsComponent.prototype.round = function (val) {
                    return val.toFixed(2);
                };
                FactorioPartsComponent.prototype.populateParts = function () {
                    this.results = [];
                    for (var _i = 0, _a = this.recipes; _i < _a.length; _i++) {
                        var recipe = _a[_i];
                        for (var _b = 0, _c = recipe.results; _b < _c.length; _b++) {
                            var result = _c[_b];
                            if (!this.hasPart(result.name)) {
                                this.results.push(result);
                            }
                        }
                    }
                };
                FactorioPartsComponent.prototype.hasPart = function (name) {
                    for (var _i = 0, _a = this.results; _i < _a.length; _i++) {
                        var result = _a[_i];
                        if (result.name == name) {
                            return true;
                        }
                    }
                    return false;
                };
                FactorioPartsComponent.prototype.findPart = function (part) {
                    var options = [];
                    for (var _i = 0, _a = this.recipes; _i < _a.length; _i++) {
                        var recipe = _a[_i];
                        if (recipe.name == part) {
                            options.push(recipe);
                        }
                        for (var _b = 0, _c = recipe.results; _b < _c.length; _b++) {
                            var res = _c[_b];
                            if (res.name == part) {
                                options.push(recipe);
                            }
                        }
                    }
                    return options;
                };
                FactorioPartsComponent.prototype.loadRecipes = function () {
                    var _this = this;
                    this.http.get('resources/recipes.json')
                        .subscribe(function (res) {
                        var recipes = res.json();
                        for (var key in recipes) {
                            var recipe = recipes[key];
                            _this.recipes.push(recipe_1.recipeFactory(recipe));
                        }
                        ;
                        _this.recipes.sort(function (a, b) {
                            return a.name < b.name ? -1 : 1;
                        });
                        _this.populateParts();
                        _this.initFromRoute();
                    });
                };
                FactorioPartsComponent.prototype.ngOnInit = function () {
                    this.loadRecipes();
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], FactorioPartsComponent.prototype, "currentResultName", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], FactorioPartsComponent.prototype, "currentRecipeName", void 0);
                FactorioPartsComponent = __decorate([
                    core_1.Component({
                        selector: 'factorio-parts',
                        templateUrl: 'tpl/factorio-parts.html',
                        directives: [common_1.NgClass, router_1.RouterLink],
                        providers: [http_1.HTTP_PROVIDERS]
                    }),
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http, router_1.Router, router_1.RouteParams])
                ], FactorioPartsComponent);
                return FactorioPartsComponent;
            }());
            exports_1("FactorioPartsComponent", FactorioPartsComponent);
        }
    }
});
//# sourceMappingURL=factorio-parts.js.map