var fs = require('fs');
var _ = require('lodash');
var util = require('./util.js');
var mu = require('mu2');

var inputDir = __dirname + '/input';
var outputDir = __dirname + '/output';

var provinces = util.readCsv(inputDir + '/provinces.csv');
var provinceLookup = _.indexBy(provinces, function(d){return d.enAbbr;});
var matrix = util.readCsvWithoutHeader(outputDir + '/step3_curated.csv');

var cells = util.convertMatrixToList(matrix).map(function(cell){
  return _.extend({
    x: cell.col,
    y: cell.row
  }, provinceLookup[cell.value]);
});

console.log(cells);

fs.writeFileSync(outputDir + '/gridmap-layout-thailand.json', JSON.stringify(cells));
fs.writeFileSync(outputDir + '/gridmap-layout-thailand.csv', ['x,y,thAbbr,thName,enAbbr,enName'].concat(cells.map(function(cell){
  return [cell.x, cell.y, cell.thAbbr, cell.thName, cell.enAbbr, cell.enName].join(',');
})).join('\n'));

var txt = '';
mu.compileAndRender(__dirname + '/template.mustache', {data: JSON.stringify(cells, null, 2)})
  .on('data', function(data){
    txt += data.toString();
  })
  .on('end', function(output){
    fs.writeFileSync(outputDir + '/gridmap-layout-thailand.js', txt);
  });