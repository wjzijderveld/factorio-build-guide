System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Category, Type;
    return {
        setters:[],
        execute: function() {
            (function (Category) {
                Category[Category["Item"] = 0] = "Item";
                Category[Category["Chemistry"] = 1] = "Chemistry";
            })(Category || (Category = {}));
            exports_1("Category", Category);
            (function (Type) {
                Type[Type["Item"] = 0] = "Item";
                Type[Type["Fluid"] = 1] = "Fluid";
            })(Type || (Type = {}));
            exports_1("Type", Type);
        }
    }
});
//# sourceMappingURL=recipe.js.map