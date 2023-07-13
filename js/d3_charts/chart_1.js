import * as d3 from 'd3';
import { darkMode } from '../dark_mode';
import { annotation, annotationLabel } from 'd3-svg-annotation';

// Chart 1 D3 Charting
var xScale;
var yScale;
var color;
var filteredData;

const svg = d3.select("#chart-1").attr("viewBox", `0 0 1000 300`),
    margin = { top: 40, right: 0, bottom: 50, left: 60 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

const g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const parseDate = d3.timeParse("%Y-%m-%d");

d3.csv("games.csv").then(function (data) {
    data.forEach(function (d) {
        d.released = parseDate(d.released)?.getFullYear();
        d.rating = +d.rating;
    });

    const ratingByYear = d3.rollups(data, v => d3.mean(v, d => d.rating), d => d.released);
    ratingByYear.sort((a, b) => d3.ascending(a[0], b[0]));
    filteredData = ratingByYear.filter(d => d[0] >= 1970 && d[0] <= 2022);

    xScale = d3.scaleBand()
        .domain(filteredData.map(d => d[0]))
        .range([0, width])
        .padding(0.2);

    yScale = d3.scaleLinear()
        .domain([0, d3.max(filteredData, d => d[1])])
        .range([height, 0]);

    g.selectAll("rect")
        .data(filteredData)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d[0]))
        .attr("y", height)
        .attr("width", xScale.bandwidth())
        .attr("height", 0);

    const annotations = [
        {
            type: annotationLabel,
            note: {
                label: "2014-2017 saw a 50% decline in rating",
            },
            x: xScale(filteredData[40][0]),
            y: yScale(filteredData[40][1]),
            dx: -160,
            dy: -120,
        },
    ];

    const makeAnnotations = annotation().type(annotationLabel).annotations(annotations);

    // Updates color depending on dark mode
    updateChart1DarkMode(darkMode);

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale).tickValues(filteredData.map(d => d[0])))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    g.append("g")
        .call(d3.axisLeft(yScale))

    g.append("g")
        .call(makeAnnotations);

    // Y-axis label
    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left)
        .attr("x", -height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "15px")
        .text("Average Rating");

    // X-axis label
    g.append("text")
        .attr("transform", "translate(" + width / 2 + " ," + (height + margin.top + 10) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "15px")
        .text("Year");

}).catch(function (error) {
    console.log(error);
});

export function animateChart1() {
    g.selectAll('rect').transition()
        .duration(400)
        .ease(d3.easeCircle)
        .delay((d, i) => i * 50)
        .attr("y", d => {
            const yValue = yScale(d[1]);
            return isNaN(yValue) ? height : yValue;
        })
        .attr("height", d => {
            const barHeight = height - yScale(d[1]);
            return isNaN(barHeight) ? 0 : barHeight;
        });
}

export function updateChart1DarkMode(isDarkMode) {
    color = isDarkMode ? d3.scaleSequentialPow(d3.interpolateRainbow)
        .domain([0, 3.838125]) : d3.scaleSequentialPow(d3.interpolateRdYlGn)
            .domain([0, 3.838125]);
    svg.selectAll("#chart-1 rect")
        .style("fill", d => color(d[1]));
}

function sortChart1(event) {
    switch (event.target.value) {
        case "year":
            filteredData.sort((a, b) => d3.ascending(a[0], b[0]));
            break;
        case "asc":
            filteredData.sort((a, b) => d3.ascending(a[1], b[1]));
            break;
        case "desc":
            filteredData.sort((a, b) => d3.descending(a[1], b[1]));
            break;
    }

    updateChart1();
    animateChart1();
    updateChart1DarkMode(darkMode);
}

function updateChart1() {
    xScale.domain(filteredData.map(d => d[0]));
    yScale.domain([0, d3.max(filteredData, d => d[1])]);

    g.select("g")
        .transition()
        .duration(400)
        .ease(d3.easeCircle)
        .call(d3.axisBottom(xScale).tickValues(filteredData.map(d => d[0])))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    g.selectAll('rect').data(filteredData)
        .transition()
        .duration(400)
        .ease(d3.easeCircle)
        .attr("x", d => xScale(d[0]))
        .attr("y", d => {
            const yValue = yScale(d[1]);
            return isNaN(yValue) ? height : yValue;
        })
        .attr("width", xScale.bandwidth())
        .attr("height", d => {
            const barHeight = height - yScale(d[1]);
            return isNaN(barHeight) ? 0 : barHeight;
        });

    g.selectAll(".annotation").remove();
}
document.getElementById("sort").addEventListener("change", sortChart1);
