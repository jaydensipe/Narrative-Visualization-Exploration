import * as d3 from 'd3';

const margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

const svg = d3
    .select("#page-3")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv(
    "games.csv",
).then(function (csvData) {
    const x = d3.scaleLinear().domain([3, 9]).range([0, width]);
    const xAxis = svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    const y = d3.scaleLinear().domain([0, 9]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    svg
        .append("g")
        .selectAll("circle")
        .data(csvData)
        .join("circle")
        .attr("cx", function (d) {
            return x(d.Sepal_Length);
        })
        .attr("cy", function (d) {
            return y(d.Petal_Length);
        })
        .attr("r", 5);
});