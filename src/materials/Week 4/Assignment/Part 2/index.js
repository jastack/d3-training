function buildChart(containerId) {
  //size globals
  var width = document.documentElement.clientWidth - 50;
  var height = document.documentElement.clientHeight - 50;

  var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 100
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
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  d3.csv('../air_quality.csv', (error, data) => {
    if (error) {
      console.error('failed to read data');
      return;
    }

    data.forEach(d => {
      d.Emissions = +d.Emissions.replace(/,/g, '');
    });

    var colorMap = {};
    var colorPicker = d3.schemeCategory10;
    data.forEach(d => {
      if (!colorMap[d.Region]) {
        colorMap[d.Region] = colorPicker.shift();
      }
    });

    // scales
    var x = d3
      .scaleBand()
      .domain(
        data.map(d => {
          return d.State;
        })
      )
      .range([0, innerWidth])
      .padding(0.2);

    var y = d3
      .scaleLinear()
      .domain(d3.extent(data, d => d.Emissions))
      .range([innerHeight, 0]);

    // axes
    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);

    g
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis);

    g
      .append('g')
      .attr('class', 'x-axis')
      .call(yAxis);

    // bars
    var bar = g
      .append('g')
      .selectAll('g')
      .data(data)
      .enter()
      .append('g')
      .attr('transform', (d, i) => {
        return `translate(${x(d.State)},${y(d.Emissions)})`;
      });

    bar
      .append('rect')
      .attr('width', x.bandwidth())
      .attr('height', d => {
        return innerHeight - y(d.Emissions);
      })
      .attr('fill', d => {
        return colorMap[d.Region];
      });

    var regionEmission = {};
    data.forEach(d => {
      if (regionEmission[d.Region]) {
        regionEmission[d.Region]['emission'] += d.Emissions;
        regionEmission[d.Region]['count'] += 1;
      } else {
        regionEmission[d.Region] = { emission: d.Emissions, count: 1 };
      }
    });

    console.log(regionEmission);

    // legend
    var colorData = Object.keys(colorMap).map(region => {
      return {
        region,
        color: colorMap[region],
        emission:
          regionEmission[region]['emission'] / regionEmission[region]['count']
      };
    });

    var legendPosition = {
      x: 50,
      y: 50,
      barWidth: 100,
      barHeight: 25,
      maxWidth: 250
    };

    var legendScale = d3
      .scaleLinear()
      .domain(d3.extent(colorData, d => d.emission))
      .range([legendPosition.barWidth, legendPosition.maxWidth]);

    var legend = g
      .append('g')
      .selectAll('g')
      .data(colorData)
      .enter()
      .append('g')
      .attr('transform', (d, i) => {
        return `translate(${legendPosition.x}, ${legendPosition.y +
          legendPosition.barHeight * i})`;
      });

    legend
      .append('rect')
      .attr('width', d => {
        return legendScale(d.emission);
      })
      .attr('height', legendPosition.barHeight)
      .attr('fill', d => {
        return d.color;
      });

    legend
      .append('text')
      .attr('x', 5)
      .attr('y', legendPosition.barHeight / 2 - 5)
      .attr('dominant-baseline', 'hanging')
      .attr('fill', 'white')
      .text(d => {
        return d.region;
      });

    g
      .append('text')
      .attr('class', 'x-axis-label')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 30)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'hanging')
      .text('State');

    var label = g.append('g');

    label
      .append('text')
      .attr('class', 'x-axis-label')
      .attr('x', -innerHeight / 2)
      .attr('y', -80)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'hanging')
      .text('Emissions');

    g
      .append('text')
      .attr('class', 'title')
      .attr('x', innerWidth / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'baseline')
      .style('font-size', 24)
      .text('Emissions by State');
  });
}

buildChart('#viz');
