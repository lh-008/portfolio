import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Remove existing SVG
d3.select('svg').remove();

// Create a container for the pie chart and legend
const chartContainer = d3.select('body')
                         .insert('div', 'h2.projects-title')
                         .attr('class', 'chart-container');

// Append an SVG to the container for the pie chart
const svg = chartContainer
              .append('svg')
              .attr('viewBox', '-50 -50 100 100')
              .attr('width', 200)
              .attr('height', 200);

// Define the arc generator
const arcGenerator = d3.arc()
                       .innerRadius(0) // Full pie chart (no hole)
                       .outerRadius(50); // Radius of the pie chart

// Data for the pie chart
let data = [
  { value: 1, label: 'apples' },
  { value: 2, label: 'oranges' },
  { value: 3, label: 'mangos' },
  { value: 4, label: 'pears' },
  { value: 5, label: 'limes' },
  { value: 5, label: 'cherries' },
];

// Use D3's color scale to assign colors dynamically
const colors = d3.scaleOrdinal(d3.schemeTableau10);

// Generate slices
let sliceGenerator = d3.pie().value((d) => d.value);
let arcData = sliceGenerator(data);

// Append slices to the SVG
arcData.forEach((d, idx) => {
  svg.append('path')
    .attr('d', arcGenerator(d))
    .attr('fill', colors(idx));
});

// Add the legend to the same container
const legend = chartContainer
                 .append('ul')
                 .attr('class', 'legend');

// Dynamically generate legend items
data.forEach((d, idx) => {
  legend.append('li')
    .attr('style', `--color: ${colors(idx)}`) // Style for color
    .html(`<span class="swatch" style="background-color:${colors(idx)};"></span>
           ${d.label} <em>(${d.value})</em>`); // Add the swatch, label, and value
});

// Fetch and render project data
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');
