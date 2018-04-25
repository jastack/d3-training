// Initialize the svg
var height = document.documentElement.clientHeight;
var width = document.documentElement.clientWidth;

var svg = d3
  .select('#viz')
  .append('svg')
  .attr('height', height)
  .attr('width', width);

d3.json('../data.json', (error, data) => {
    animate(data);
});

function updateViz(data) {
  var selection = svg.selectAll('circle').data(data);

  selection
    .enter()
    .append('circle')
    .attr('cx', d => {
        return Math.random() * height;
    })
    .attr('cy', d => {
        return Math.random() * width;
    })
    .attr('r', d => {
      return d.size;
    })
    .attr('fill', d => {
        return d.color;
    })
    .attr('stroke', d => {
      return d.color;
    })
    .attr('stroke-width', 2);

  selection.exit().remove();
}

function animate(data) {
  updateViz(data);
  var loop = setInterval(function() {
    if (data.length === 0) {
      clearInterval(loop);
    }
    data.pop();
    updateViz(data);
  }, 2000);
}
