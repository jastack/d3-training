// Initialize the svg
var height = document.documentElement.clientHeight;
var width = document.documentElement.clientWidth;

var svg = d3
  .select('#viz')
  .append('svg')
  .attr('height', height)
  .attr('width', width);

d3.json('../data.json', function(err, data) {
  var xPos = {};
  var selection = svg.selectAll('rect').data(data);
  var margin = 20;
  var start = margin;

  data.forEach((el, i) => {
    xPos[i] = start;
    start += el.size + margin;
  });

  selection
    .enter()
    .append('rect')
    .attr('x', (d, i) => {
      return xPos[i];
    })
    .attr('y', 100)
    .attr('height', d => {
      return d.size;
    })
    .attr('width', d => {
      return d.size;
    })
    .attr('fill', d => {
      return d.color;
    });

  var circles = svg.selectAll('circle').data(data);
  circles
    .enter()
    .append('circle')
    .attr('cx', d => {
      return d.size;
    })
    .attr('cy', d => {
      return 2 * d.size;
    })
    .attr('r', 10)
    .attr('fill', d => {
      return d.color;
    });
});
