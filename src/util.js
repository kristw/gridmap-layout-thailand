var d3 = require('d3');
var fs = require('fs');

function convertListToMatrix(list, rowFn, colFn, keyFn){
  var maxCol = d3.max(list, colFn) + 1;
  var maxRow = d3.max(list, rowFn) + 1;

  var matrix = [];
  for(var i=0;i<maxRow;i++){
    matrix.push(new Array(maxCol));
  }

  list.forEach(function(d){
    matrix[rowFn(d)][colFn(d)] = keyFn(d);
  });

  return matrix;
}

function convertMatrixToList(matrix){
  var cells = [];
  for(var i=0;i<matrix.length;i++){
    for(var j=0;j<matrix[i].length;j++){
      var value = matrix[i][j].trim();
      if(value!==''){
        cells.push({
          col: j,
          row: i,
          value: value
        });
      }
    }
  }
  return cells;
}

function readCsv(name){
  return d3.csv.parse(fs.readFileSync(name, 'utf8'));
}

function readCsvWithoutHeader(name){
  return d3.csv.parseRows(fs.readFileSync(name, 'utf8'));
}

function saveAsCsv(name, rows){
  fs.writeFileSync(name, rows.map(function(d){return d.join(',');}).join('\n'));
}

module.exports = {
  convertListToMatrix: convertListToMatrix,
  convertMatrixToList: convertMatrixToList,
  readCsv: readCsv,
  readCsvWithoutHeader: readCsvWithoutHeader,
  saveAsCsv: saveAsCsv
};