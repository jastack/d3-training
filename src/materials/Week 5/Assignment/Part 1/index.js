function buildChart(containerId) {
  //size globals
  var width = document.documentElement.clientWidth - 50;
  var height = document.documentElement.clientHeight - 50;

  var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
  };

  var innerWidth = width - margin.left - margin.right;
  var innerHeight = height - margin.top - margin.bottom;

  var svg = d3
    .select(containerId)
    .append('svg')
    .attr('height', height)
    .attr('width', width);

  var g = svg
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  d3.json('../climate.json', (error, data) => {
    if (error) {
      console.error('Failed to read data');
      return;
    }

    var parseTime = d3.timeParse('%Y');
    data.forEach(d => {
      d.temp = +d.temp;
      d.year = parseTime((+d.year).toString());
    });

    console.log(data);
  });
}

buildChart('#chart-holder');
