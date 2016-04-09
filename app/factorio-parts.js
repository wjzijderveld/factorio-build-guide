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
    var BasicOilOutput, AdvancedOilOutput, ChemistryLayout, FactorioPartsComponent;
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
            BasicOilOutput = (function () {
                function BasicOilOutput(refineries) {
                    if (refineries === void 0) { refineries = 1; }
                    this.refineries = refineries;
                    this['petroleum-gas'] = 4 * 12 * this.refineries;
                    this['light-oil'] = 3 * 12 * this.refineries;
                    this['heavy-oil'] = 3 * 12 * this.refineries;
                }
                BasicOilOutput.prototype.forRefineries = function (x) {
                    return new BasicOilOutput(x);
                };
                return BasicOilOutput;
            }());
            AdvancedOilOutput = (function () {
                function AdvancedOilOutput(refineries) {
                    if (refineries === void 0) { refineries = 1; }
                    this.refineries = refineries;
                    this['petroleum-gas'] = 5.5 * 12 * this.refineries;
                    this['light-oil'] = 4.5 * 12 * this.refineries;
                    this['heavy-oil'] = 1 * 12 * this.refineries;
                }
                AdvancedOilOutput.prototype.forRefineries = function (x) {
                    return new AdvancedOilOutput(x);
                };
                return AdvancedOilOutput;
            }());
            ChemistryLayout = (function () {
                function ChemistryLayout(refineries, chemplants) {
                    this.refineries = refineries;
                    this.chemplants = chemplants;
                    console.log(this.getTypes());
                }
                ChemistryLayout.prototype.getTypes = function () {
                    return this.chemplants.reduce(function (unique, chemplant) {
                        if (unique.indexOf(chemplant.recipe.name) == -1) {
                            unique.push(chemplant.recipe.name);
                        }
                        return unique;
                    }, []);
                };
                ChemistryLayout.prototype.getGrouped = function () {
                    return this.chemplants.reduce(function (grouped, chemplant) {
                        if (undefined == grouped[chemplant.recipe.name]) {
                            grouped[chemplant.recipe.name] = [];
                        }
                        grouped[chemplant.recipe.name].push(chemplant);
                        return grouped;
                    }, {});
                };
                return ChemistryLayout;
            }());
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
                    this.oilProcessingType = 'basic';
                    this.oilOutput = new BasicOilOutput();
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
                    var needMore = true;
                    var plan;
                    var iteration = 0;
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
                };
                FactorioPartsComponent.prototype.getChemistryBuildPlan = function (recipes, refineries) {
                    var _this = this;
                    var output = 0;
                    var oilOutput = this.oilOutput.forRefineries(refineries);
                    var chemplants = [];
                    var rawProducts = ['heavy-oil', 'light-oil', 'petroleum-gas'];
                    var rawProduct = function (name) { return rawProducts.indexOf(name) >= 0; };
                    var leftOvers = {};
                    if (rawProduct(this.currentResultName)) {
                        output += oilOutput[this.currentResultName];
                        oilOutput[this.currentResultName] = 0;
                    }
                    for (var _i = 0, rawProducts_1 = rawProducts; _i < rawProducts_1.length; _i++) {
                        var product = rawProducts_1[_i];
                        if (!oilOutput[product]) {
                            break;
                        }
                        var recipe = void 0;
                        if (product == 'heavy-oil') {
                            recipe = this.recipes.filter((function (r) { return r.name === 'heavy-oil-cracking'; }))[0];
                        }
                        else {
                            var found = false;
                            for (var _a = 0, recipes_1 = recipes; _a < recipes_1.length; _a++) {
                                var r = recipes_1[_a];
                                for (var _b = 0, _c = r.ingredients; _b < _c.length; _b++) {
                                    var i = _c[_b];
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
                        var _loop_1 = function() {
                            var perMinute = Math.floor(60 / recipe.time);
                            chemplants.push({ recipe: recipe });
                            for (var _d = 0, _e = recipe.ingredients; _d < _e.length; _d++) {
                                var i = _e[_d];
                                if (i.name == product) {
                                    oilOutput[product] -= i.amount * perMinute;
                                }
                            }
                            recipe.results.filter(function (r) { return rawProduct(r.name); }).forEach(function (r) {
                                oilOutput[r.name] += r.amount * perMinute;
                            });
                            recipe.results.filter(function (r) { return r.name == _this.currentResultName; }).forEach(function (r) {
                                output += r.amount * perMinute;
                            });
                        };
                        while (oilOutput[product] > 0) {
                            _loop_1();
                        }
                    }
                    return {
                        output: output,
                        leftOvers: leftOvers,
                        layout: new ChemistryLayout(refineries, chemplants)
                    };
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
                    if (this.recipeType == 'chemistry') {
                        this.oilProcessingType = this._routeParams.params['oilProcessing'] || 'basic';
                    }
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
                        if (category && recipe.category && recipe.category.indexOf(category) == -1) {
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