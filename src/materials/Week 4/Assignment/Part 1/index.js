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
  var colors = d3.schemeCategory20;

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

    // sclea
    var xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, d => d.temp))
      .range([0, innerWidth]);

    var yScale = d3
      .scaleBand()
      .domain(
        data.map(d => {
          return d.year;
        })
      )
      .range([0, innerHeight])
      .padding(0.2);

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale).tickValues(data.filter(d => {
      return d.year % 10 === 0;
    }).map(d => d.year));

    // x-axis
    g
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis);

      // y-axis
      g
      .append('g')
      .attr('class', 'y-axis')
      .call(yAxis.ticks(5));

    // bars
    var bar = g
      .selectAll('.g')
      .data(data)
      .enter()
      .append('g')
      .attr('transform', (d, i) => {
        return `translate(0, ${i * (barWidth + spaceBetween)})`;
      });

    bar
      .append('rect')
      .attr('width', d => {
        return xScale(d.temp);
      })
      .attr('height', 5)
      .attr('fill', (d, i) => {
        return colors[Math.floor(i / 10)];
      });

    // x-axis label
    g
      .append('text')
      .attr('class', 'x-axis-label')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 30)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'hanging')
      .text('Temperature');

    // title
    g
      .append('text')
      .attr('class', 'title')
      .attr('x', innerWidth / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'baseline')
      .style('font-size', 24)
      .text('Average global temperatures by year');

  });
}

buildChart('#viz');
