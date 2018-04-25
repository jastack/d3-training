// Initialize svg canvas
var height = document.documentElement.clientHeight;
var width = document.documentElement.clientWidth;
var margin = 20;

var verticalStart = margin;

var svg = d3
  .select('#viz')
  .append('svg')
  .attr('height', height)
  .attr('width', width);

// Create blue rectangle that is 100 pixels in width and 20 pixels in height
var recHeight = 20;
var recWidth = 100;

svg
  .append('rect')
  .attr('x', (width - recWidth) / 2)
  .attr('y', verticalStart)
  .attr('height', recHeight)
  .attr('width', recWidth)
  .attr('fill', 'blue')
  .attr('stroke', 'black');

verticalStart += recHeight;

// Three orange circles, each with a 2px thick blue border. Each circle should have double
// the radius of the previous one.
var numCircles = 3;
var initialRadius = 10;
var spaceBetween = 5;

const circleSectionLength =
  2 * initialRadius * ((1 - Math.pow(2, numCircles)) / -1) +
  (numCircles - 1) * spaceBetween;

var cx = (width - circleSectionLength) / 2 + initialRadius;
var cy = initialRadius * Math.pow(2, numCircles - 1) + margin + verticalStart;

for (let i = 0; i < numCircles; i++) {
  svg
    .append('circle')
    .attr('cx', cx)
    .attr('cy', cy)
    .attr('r', initialRadius)
    .attr('fill', 'orange')
    .attr('stroke', 'blue')
    .attr('stroke-width', '2');

  cx += initialRadius + spaceBetween + 2 * initialRadius;
  initialRadius *= 2;
}

verticalStart += margin + initialRadius;
// Underneath the circle create an octagon
var radius = 80;
var apo = radius * Math.cos(Math.PI / 8);
var cx = width / 2;
var cy = verticalStart + apo + margin;
var points = '';

for (let i = 0; i < 8; i++) {
  let theta = Math.PI / 8 + Math.PI / 4 * i;
  let x = cx + radius * Math.cos(theta);
  let y = cy - radius * Math.sin(theta);
  points += `${x}, ${y} `;
}

svg.append('polygon').attr('points', points);
