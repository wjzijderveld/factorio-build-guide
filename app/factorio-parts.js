System.register(['angular2/core', 'angular2/common', 'angular2/http', './recipe'], function(exports_1, context_1) {
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
    var core_1, common_1, http_1, recipe_1;
    var FactorioPartsComponent;
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
            function (recipe_1_1) {
                recipe_1 = recipe_1_1;
            }],
        execute: function() {
            FactorioPartsComponent = (function () {
                function FactorioPartsComponent(http) {
                    this.http = http;
                    this.parts = [];
                    this.amount = 1;
                    this.assemblerCount = 1;
                }
                FactorioPartsComponent.prototype.updateBuild = function () {
                    var newPart = this.findPart(this.selectedPart);
                    if (!newPart) {
                        return;
                    }
                    this.currentPart = newPart;
                    this.assemblerCount = Math.ceil(this.amount / (60 / this.currentPart.time));
                };
                FactorioPartsComponent.prototype.changeBuild = function (ingredient) {
                    if (!this.findPart(ingredient.name)) {
                        return;
                    }
                    this.selectedPart = ingredient.name;
                    this.amount = ingredient.amount * this.assemblerCount;
                    this.updateBuild();
                };
                FactorioPartsComponent.prototype.hasRecipe = function (ingredient) {
                    return this.findPart(ingredient.name) !== undefined;
                };
                FactorioPartsComponent.prototype.ceil = function (val) {
                    return Math.ceil(val);
                };
                FactorioPartsComponent.prototype.round = function (val) {
                    return val.toFixed(2);
                };
                FactorioPartsComponent.prototype.findPart = function (part) {
                    for (var key in this.parts) {
                        if (this.parts[key].name == part) {
                            return this.parts[key];
                        }
                    }
                };
                FactorioPartsComponent.prototype.getRecipes = function () {
                    var _this = this;
                    this.http.get('resources/recipes.json')
                        .subscribe(function (res) {
                        var recipes = res.json();
                        for (var key in recipes) {
                            var recipe = recipes[key];
                            _this.parts.push(recipe_1.Recipe.fromResponse(recipe));
                        }
                        ;
                        _this.parts.sort(function (a, b) {
                            return a.name < b.name ? -1 : 1;
                        });
                        _this.currentPart = _this.parts[0];
                        _this.selectedPart = _this.currentPart.name;
                    });
                };
                FactorioPartsComponent.prototype.ngOnInit = function () {
                    this.getRecipes();
                };
                FactorioPartsComponent.prototype.ngOnChanges = function () {
                    console.log('OnChanges');
                    console.log(arguments);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', recipe_1.Recipe)
                ], FactorioPartsComponent.prototype, "currentPart", void 0);
                FactorioPartsComponent = __decorate([
                    core_1.Component({
                        selector: 'factorio-parts',
                        templateUrl: 'tpl/factorio-parts.html',
                        directives: [common_1.NgClass],
                        providers: [http_1.HTTP_PROVIDERS]
                    }),
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], FactorioPartsComponent);
                return FactorioPartsComponent;
            }());
            exports_1("FactorioPartsComponent", FactorioPartsComponent);
        }
    }
});
//# sourceMappingURL=factorio-parts.js.map