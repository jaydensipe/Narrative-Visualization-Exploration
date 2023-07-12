import * as d3 from 'd3';

// Chart 1 D3 Charting
var xScale = null;
var yScale = null;
var bars = null;

const svg = d3.select("#chart-1"),
    margin = { top: 0, right: 0, bottom: 30, left: 0 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

d3.csv("games.csv").then(function (data) {
    svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const parseDate = d3.timeParse("%Y-%m-%d");
    data.forEach(function (d) {
        d.released = parseDate(d.released)?.getFullYear();
        d.rating = +d.rating;
    });

    const ratingByYear = d3.rollups(data, v => d3.mean(v, d => d.rating), d => d.released);
    ratingByYear.sort((a, b) => d3.ascending(a[0], b[0]));
    const filteredData = ratingByYear.filter(d => d[0] >= 1970 && d[0] <= 2022);

    xScale = d3.scaleBand()
        .domain(filteredData.map(d => d[0]))
        .range([0, width])
        .padding(0.2);

    yScale = d3.scaleLinear()
        .domain([0, d3.max(filteredData, d => d[1])])
        .range([height, 0]);

    bars = svg.selectAll("rect")
        .data(filteredData)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d[0]))
        .attr("y", height)
        .attr("width", xScale.bandwidth())
        .attr("height", 0)
        .style("fill", "steelblue");

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale).tickValues(filteredData.map(d => d[0])))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    svg.append("g")
        .call(d3.axisLeft(yScale));
}).catch(function (error) {
    console.log(error);
});

export function animateChart1() {
    bars.transition()
        .duration(400)
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
