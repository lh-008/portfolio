import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let query = '';
let selectedIndex = -1;
const searchInput = document.querySelector('.searchBar');

let projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
function renderPieChart(projectsGiven) {
    let newRolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year,
    );

    let newData = newRolledData.map(([year, count]) => ({
        value: count,
        label: year,
    }));

    let newSliceGenerator = d3.pie().value((d) => d.value);
    let newArcData = newSliceGenerator(newData);
    let newArcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    let newArcs = newArcData.map((d) => newArcGenerator(d));

    let svg = d3.select('svg');
    svg.selectAll('path').remove();
    let legend = d3.select('.legend');
    legend.selectAll('li').remove();

    newArcs.forEach((arc, idx) => {
        svg.append('path')
            .attr('d', arc)
            .attr('fill', d3.schemeTableau10[idx % d3.schemeTableau10.length])
            .attr('class', idx === selectedIndex ? 'selected' : '')
            .on('click', () => {
                selectedIndex = selectedIndex === idx ? -1 : idx;

                if (selectedIndex === -1) {
                    renderProjects(projects, projectsContainer, 'h2');
                } else {
                    const selectedYear = newData[selectedIndex].label;
                    const filteredProjects = projects.filter(
                        (project) => project.year === selectedYear
                    );
                    renderProjects(filteredProjects, projectsContainer, 'h2');
                }

                renderPieChart(projectsGiven);
            });
    });

    newData.forEach((d, idx) => {
        legend.append('li')
            .attr('style', `--color:${d3.schemeTableau10[idx % d3.schemeTableau10.length]}`)
            .attr('class', idx === selectedIndex ? 'selected' : '')
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
            .on('click', () => {
                selectedIndex = selectedIndex === idx ? -1 : idx;
                if (selectedIndex === -1) {
                    renderProjects(projects, projectsContainer, 'h2');
                } else {
                    const selectedYear = d.label;
                    const filteredProjects = projects.filter(
                        (project) => project.year === selectedYear
                    );
                    renderProjects(filteredProjects, projectsContainer, 'h2');
                }

                renderPieChart(projectsGiven);
            });
    });
}

renderPieChart(projects);
searchInput.addEventListener('input', (event) => {
    query = event.target.value.toLowerCase();

    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query);
    });

    renderProjects(filteredProjects, projectsContainer, 'h2');
    renderPieChart(filteredProjects);
});

renderProjects(projects, projectsContainer, 'h2');
