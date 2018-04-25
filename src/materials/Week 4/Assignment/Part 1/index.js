function buildChart(containerId) {
  // size globals
  var width = document.documentElement.clientWidth - 50;
  var height = 1059;

  var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
  };

  var barWidth = 5;
  var spaceBetween = 2;

  var innerWidth = width - margin.left - margin.right;
  var innerHeight = height - margin.top - margin.bottom;
  var colors = d3.schemeCategory10;

  var svg = d3
    .select(containerId)
    .append('svg')
    .attr('height', height)
    .attr('width', width);

  var g = svg
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // read in data
  d3.json('../climate.json', (error, data) => {
    if (error) {
      console.error('failed to read data');
      return;
    }

    // coerce data to numeric
    data.forEach(d => {
      d.temp = +d.temp;
      d.year = +d.year;
    });

    var xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, d => d.temp))
      .range([0, innerWidth]);

    var xAxis = d3.axisBottom(xScale);

    g
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis);

    g
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('y', (d, i) => {
        return (barWidth + spaceBetween) * i;
      })
      .attr('width', d => {
        return xScale(d.temp);
      })
      .attr('height', 5)
      .attr('fill', (d, i) => {
        return colors[Math.floor(i / 10) % 10];
      });

    g
      .append('text')
      .attr('class', 'x-axis-label')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 30)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'hanging')
      .text('Temperature');

    g
      .append('text')
      .attr('class', 'title')
      .attr('x', innerWidth / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'baseline')
      .style('font-size', 24)
      .text('Average global temperatures by year')
  });
}

buildChart('#viz');
