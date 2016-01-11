# gridmap-layout-thailand

Positions of tiles for Thailand grid map visualization

<p align="center">
  <img src="examples/screenshot.png">
</p>

### Install

```
npm install gridmap-layout-thailand --save
```

or

```
bower install gridmap-layout-thailand --save
```

The data files can be found in the ```dist``` directory of the installed package. Either one of these files below can be used:

- dist/gridmap-layout-thailand.json
- dist/gridmap-layout-thailand.csv
- dist/gridmap-layout-thailand.js
- dist/gridmap-layout-thailand.min.js

The data in each file is an array of values in this format:

```
[
  {
    "x": 2, // column index
    "y": 0, // row index
    "enName": "ChiangRai",
    "enAbbr": "CRI",
    "thName": "เชียงราย",
    "thAbbr": "ชร"
  },
  ...
]
```

### Example Usage

One way to use this is to use with D3.

```
d3.json('path/to/gridmap-layout-thailand/gridmap-layout-thailand.json', function(error, thgridmap){
  var svg = d3.select('svg');

  var sEnter = svg.append('g')
    .selectAll('g')
      .data(thgridmap)
    .enter().append('g')
      .attr('transform', function(d){return 'translate('+(d.x*24)+','+(d.y*24)+')';});

  sEnter.append('rect')
    .attr('width', 24)
    .attr('height', 24)
    .attr('vector-effect', 'non-scaling-stroke')
    .style('opacity', 0.5)
    .style('stroke', '#aaa')
    .style('fill', '#ccc');

  sEnter.append('text')
    .attr('x', 12)
    .attr('y', 16)
    .style('text-anchor', 'middle')
    .text(function(d){return d.thAbbr;});
});
```

### Development

```
npm run precurate
```

After editing ```src/output/step3.csv``` and save as ```src/output/step3_curated.csv```, run this command to produce the final output and copy to examples and dist directories.

```
npm run postcurate
```