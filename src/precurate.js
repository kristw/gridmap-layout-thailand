var d3 = require('d3');
var fs = require('fs');
var _ = require('lodash');
var util = require('./util.js');

var inputDir = __dirname + '/input';
var outputDir = __dirname + '/output';

var options = {
  rectSize: 16,
  gridSize: 10,
  offsetX: -72,
  offsetY: -24
};

var mapData = require(inputDir + '/thailand.json');
var provinces = util.readCsv(inputDir + '/provinces.csv');
var provinceLookup = _.indexBy(provinces, function(d){return d.enName;});

var width = 352;
var height = 496;

var projection = d3.geo.mercator()
  .scale(1700)
  // Customize the projection to make the center of Thailand become the center of the map
  .rotate([-100.6331, -13.2])
  .translate([width / 2, height / 2]);

var path = d3.geo.path()
  .projection(projection);

var features = mapData.features;

var blocks = features.map(function(feature){
  var centroid = path.centroid(feature);
  return {
    name: feature.properties.CHA_NE,
    cx: centroid[0],
    cy: centroid[1],
    clusterX: centroid[0],
    clusterY: centroid[1]
  };
});

var force = d3.layout.force()
  .nodes(blocks)
  .size([width, height])
  .gravity(0)
  .charge(0)
  .on('tick', tick)
  .on('end', onEnd)
  .start();

function tick(e) {
  blocks.forEach(gravity(0.2 * e.alpha));
  blocks.forEach(collide(0.5));
}

function onEnd(){
  fs.writeFileSync(
    outputDir + '/step1_collision.json',
    JSON.stringify(blocks)
  );

  blocks.forEach(function(d){
    d.cx += options.rectSize/2;
    d.cy += options.rectSize/2;
    d.cx = Math.floor(d.cx - d.cx%options.rectSize);
    d.cy = Math.floor(d.cy - d.cy%options.rectSize);
  });

  fs.writeFileSync(
    outputDir + '/step2_snap.json',
    JSON.stringify(blocks)
  );

  // convert to cell indices
  var cells = blocks.map(function(block){
    return {
      name: block.name,
      col: Math.floor((block.cx + options.offsetX - options.rectSize/2)/options.rectSize),
      row: Math.floor((block.cy + options.offsetY - options.rectSize/2)/options.rectSize)
    };
  })
  .sort(function(a,b){
    if(a.row!==b.row) return a.row-b.row;
    return a.col-b.col;
  });

  var matrix = util.convertListToMatrix(
    cells,
    function(d){return d.row;},
    function(d){return d.col;},
    function(d){return provinceLookup[d.name].enAbbr;}
  );

  console.log(matrix);
  util.saveAsCsv(outputDir + '/step3.csv', matrix);
}

// Move nodes toward cluster focus.
function gravity(alpha) {
  return function(d) {
    d.cy += (d.clusterY - d.cy) * alpha;
    d.cx += (d.clusterX - d.cx) * alpha;
  };
}

// Resolve collisions between nodes.
function collide(alpha) {
  var quadtree = d3.geom.quadtree()
    .x(function(d){return d.cx;})
    .y(function(d){return d.cy;})(blocks);

  return function(d) {
    var r = options.rectSize + 2,
        nx1 = d.cx - r,
        nx2 = d.cx + r,
        ny1 = d.cy - r,
        ny2 = d.cy + r;
    quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
        var x = d.cx - quad.point.cx,
            y = d.cy - quad.point.cy,
            l = Math.sqrt(x * x + y * y),
            r = options.rectSize + 2;
        if (l < r) {
          l = (l - r) / l * alpha;
          d.cx -= x *= l;
          d.cy -= y *= l;
          quad.point.cx += x;
          quad.point.cy += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
  };
}
