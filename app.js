/* global
 window: false, vis: false, document: false, 
 console: false, CustomEvent: false, jQuery: false,
 Blob: false, URL: false
*/
'use strict';

var 
  _queue = [],
  nodes,
  edges,
  network,
  container,
  rootItem,
  rootItemCount,
  recipes = [],
  imageForRecipe,
  rawTotals = [],
  networkOptions;

function determineRootItem() {
  var indexOf;

  rootItem = window.location.hash.substring(1) || 'rocket-part';
  rootItemCount = 1;

  indexOf = rootItem.indexOf('=');

  if (indexOf != -1) {
    rootItemCount = rootItem.substr(indexOf + 1);
    rootItem = rootItem.substr(0, indexOf);
  }
}

determineRootItem();

networkOptions = {
  physics: {
      enabled: true
  },
  layout: {
    hierarchical: {
      enabled: true
    }
  },
  nodes: {
    shape: 'box',
  }
};

window.onload = function() {

  _queue.forEach(function(cb) {
    cb();
  });

};

_queue.push(function () {

  jQuery.getJSON('/resources/recipes.json', function (recipes) {
    window.dispatchEvent(new CustomEvent('factorio.recipes_retrieved', { 'detail': recipes }));
  });
});

_queue.push(function() {

  nodes = new vis.DataSet([]);
  edges = new vis.DataSet([]);

  container = document.getElementById('explorer');

  network = new vis.Network(container, {nodes: nodes, edges: edges}, networkOptions);

  network.on('selectNode', function (data) {
    var itemId, item, edgeLabel, count;

    itemId = data.nodes[0];
    item = itemId.substr(itemId.lastIndexOf('_') + 1);
    edgeLabel = network.body.edges[data.edges[0]].labelModule.lines[0];

    count = edgeLabel.substr(edgeLabel.lastIndexOf('=') + 2);
    console.log(count);

    addIngredientsToItem(item, itemId, count, network.layoutEngine.hierarchicalLevels[itemId] + 1);
  });
});

imageForRecipe = function (recipe) {
  var html, blob, imageUrl;

  html = '<?xml version="1.0" standalone="yes"?> \
<svg xmlns = "http://www.w3.org/2000/svg" width="100%" height="100%"> \
    <rect x="25" y="25" width="250" height="200" fill="#ff0000" stroke="#000000"/> \
    <foreignObject x="50" y="50" width="200" height="150"> \
        <body xmlns="http://www.w3.org/1999/xhtml"> \
            <form> \
                <input type="text"/> \
                <input type="text"/> \
            </form> \
        </body> \
    </foreignObject> \
    <circle cx="60" cy="80" r="30" fill="#00ff00" fill-opacity="0.5"/> \
</svg>';

  blob = new Blob([html], {type: 'image/svg+xml;charset=utf-8'});

  imageUrl = URL.createObjectURL(blob);

  return imageUrl;
};

function getItemName(item) {
  if (item.hasOwnProperty('name')) {
    return item.name;
  }

  return item[0];
}

function getItemCount(item) {
  if (item.hasOwnProperty('amount')) {
    return item.amount;
  }

  return item[1];
}

function addIngredientsToItem(item, itemId, parentCount, level) {

  if (undefined === recipes[item]) {
    if (undefined === rawTotals[item]) {
      rawTotals[item] = 0;
    }
    rawTotals[item] += parentCount;
    return;
  }

  recipes[item].ingredients.forEach(function (ingredient) {
    var
      itemName = getItemName(ingredient),
      newItemId = itemId + '_' + itemName,
      itemCount = getItemCount(ingredient);

    nodes.add({
      id: newItemId,
      label: itemName,
      level: level
    });

    edges.add({
      from: itemId,
      to: newItemId,
      label: itemCount + ' x ' + parentCount + ' = ' + (itemCount * parentCount)
    });

    addIngredientsToItem(itemName, newItemId, itemCount * parentCount, level + 1);
  });
}

function loadGraph() {
  if (undefined === recipes[rootItem]) {
    throw new Error("Recipe for " + rootItem + " not found");
  }

  nodes.add({
    id: rootItem,
    label: rootItem,
    level: 0
  });

  addIngredientsToItem(rootItem, rootItem, rootItemCount, 1);

  console.log(rawTotals);
}

window.addEventListener('factorio.recipes_retrieved', function (event) {
  recipes = event.detail;
  loadGraph();
});

window.addEventListener('hashchange', function (event) {
  determineRootItem();

  nodes.clear();
  edges.clear();
  rawTotals = [];

  loadGraph();

  network.redraw();
});
